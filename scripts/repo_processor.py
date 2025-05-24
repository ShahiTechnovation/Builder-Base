
#!/usr/bin/env python3
"""
Repository Processor for LLM Analysis
Clones GitHub repositories, formats codebase, and prepares for LLM submission
"""

import os
import json
import argparse
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple
import fnmatch
import requests
from datetime import datetime

class RepoProcessor:
    def __init__(self, config_path: str = "scripts/config.json"):
        self.config = self.load_config(config_path)
        self.output_dir = Path("output")
        self.output_dir.mkdir(exist_ok=True)
        
    def load_config(self, config_path: str) -> Dict:
        """Load configuration from JSON file"""
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return self.get_default_config()
    
    def get_default_config(self) -> Dict:
        """Default configuration for repo processing"""
        return {
            "ignore_patterns": [
                "*.pyc", "*.pyo", "*.pyd", "__pycache__",
                "node_modules", ".git", ".vscode", ".idea",
                "*.log", "*.tmp", "*.temp", "*.cache",
                ".env", ".env.*", "*.key", "*.pem",
                "dist", "build", "target", "bin", "obj",
                "*.min.js", "*.min.css", "*.map",
                "package-lock.json", "yarn.lock", "composer.lock",
                "*.jpg", "*.jpeg", "*.png", "*.gif", "*.svg",
                "*.mp4", "*.avi", "*.mov", "*.pdf", "*.zip"
            ],
            "include_extensions": [
                ".py", ".js", ".ts", ".tsx", ".jsx", ".html", ".css",
                ".java", ".cpp", ".c", ".h", ".cs", ".php", ".rb",
                ".go", ".rs", ".swift", ".kt", ".scala", ".r",
                ".sql", ".json", ".yaml", ".yml", ".xml", ".md",
                ".txt", ".sh", ".bat", ".ps1", ".dockerfile"
            ],
            "max_file_size": 100000,  # 100KB
            "max_total_size": 5000000  # 5MB
        }
    
    def clone_repository(self, repo_url: str, local_path: str) -> bool:
        """Clone a GitHub repository to local path"""
        try:
            # Remove existing directory if it exists
            if os.path.exists(local_path):
                subprocess.run(["rm", "-rf", local_path], check=True)
            
            # Clone the repository
            result = subprocess.run(
                ["git", "clone", "--depth", "1", repo_url, local_path],
                capture_output=True,
                text=True,
                check=True
            )
            
            print(f"✅ Successfully cloned repository to {local_path}")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error cloning repository: {e.stderr}")
            return False
    
    def should_include_file(self, file_path: Path, relative_path: str) -> bool:
        """Determine if a file should be included in the analysis"""
        # Check ignore patterns
        for pattern in self.config["ignore_patterns"]:
            if fnmatch.fnmatch(relative_path, pattern):
                return False
            if fnmatch.fnmatch(file_path.name, pattern):
                return False
        
        # Check file extension
        if file_path.suffix.lower() not in self.config["include_extensions"]:
            return False
        
        # Check file size
        try:
            if file_path.stat().st_size > self.config["max_file_size"]:
                return False
        except OSError:
            return False
        
        return True
    
    def extract_repo_info(self, repo_url: str) -> Dict:
        """Extract repository information from GitHub API"""
        try:
            # Parse repo owner and name from URL
            parts = repo_url.replace("https://github.com/", "").split("/")
            if len(parts) >= 2:
                owner, repo_name = parts[0], parts[1].replace(".git", "")
                
                # Fetch repo info from GitHub API
                api_url = f"https://api.github.com/repos/{owner}/{repo_name}"
                response = requests.get(api_url)
                
                if response.status_code == 200:
                    return response.json()
                    
        except Exception as e:
            print(f"Warning: Could not fetch repo info: {e}")
        
        return {}
    
    def analyze_directory_structure(self, repo_path: Path) -> Dict:
        """Analyze the directory structure and file types"""
        structure = {
            "total_files": 0,
            "file_types": {},
            "directories": [],
            "main_files": []
        }
        
        for root, dirs, files in os.walk(repo_path):
            rel_root = os.path.relpath(root, repo_path)
            if rel_root != ".":
                structure["directories"].append(rel_root)
            
            for file in files:
                file_path = Path(root) / file
                rel_path = os.path.relpath(file_path, repo_path)
                
                if self.should_include_file(file_path, rel_path):
                    structure["total_files"] += 1
                    
                    # Count file types
                    ext = file_path.suffix.lower()
                    structure["file_types"][ext] = structure["file_types"].get(ext, 0) + 1
                    
                    # Identify main files
                    if file.lower() in ["readme.md", "package.json", "requirements.txt", 
                                      "cargo.toml", "pom.xml", "build.gradle", "makefile"]:
                        structure["main_files"].append(rel_path)
        
        return structure
    
    def format_repo_content(self, repo_path: Path, repo_info: Dict) -> str:
        """Format repository content for LLM analysis"""
        content_parts = []
        
        # Header with repository information
        content_parts.append("=" * 80)
        content_parts.append("REPOSITORY ANALYSIS REQUEST")
        content_parts.append("=" * 80)
        content_parts.append("")
        
        if repo_info:
            content_parts.append(f"Repository: {repo_info.get('full_name', 'Unknown')}")
            content_parts.append(f"Description: {repo_info.get('description', 'No description')}")
            content_parts.append(f"Language: {repo_info.get('language', 'Unknown')}")
            content_parts.append(f"Stars: {repo_info.get('stargazers_count', 0)}")
            content_parts.append(f"Forks: {repo_info.get('forks_count', 0)}")
            content_parts.append("")
        
        # Directory structure analysis
        structure = self.analyze_directory_structure(repo_path)
        content_parts.append("REPOSITORY STRUCTURE:")
        content_parts.append("-" * 40)
        content_parts.append(f"Total files to analyze: {structure['total_files']}")
        content_parts.append(f"File types: {dict(sorted(structure['file_types'].items()))}")
        content_parts.append(f"Main configuration files: {structure['main_files']}")
        content_parts.append("")
        
        # Add directory tree
        content_parts.append("DIRECTORY TREE:")
        content_parts.append("-" * 40)
        tree_output = subprocess.run(
            ["find", str(repo_path), "-type", "f", "-not", "-path", "*/.*", "|", "head", "-50"],
            shell=True, capture_output=True, text=True
        )
        if tree_output.stdout:
            lines = tree_output.stdout.strip().split('\n')[:20]  # Limit output
            for line in lines:
                rel_path = os.path.relpath(line, repo_path)
                content_parts.append(f"  {rel_path}")
        content_parts.append("")
        
        # Add file contents
        content_parts.append("FILE CONTENTS:")
        content_parts.append("-" * 40)
        
        total_size = 0
        files_added = 0
        
        for root, dirs, files in os.walk(repo_path):
            for file in sorted(files):
                file_path = Path(root) / file
                rel_path = os.path.relpath(file_path, repo_path)
                
                if self.should_include_file(file_path, rel_path):
                    try:
                        file_size = file_path.stat().st_size
                        if total_size + file_size > self.config["max_total_size"]:
                            content_parts.append(f"\n... (truncated - size limit reached)")
                            break
                        
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            file_content = f.read()
                        
                        content_parts.append(f"\n--- FILE: {rel_path} ---")
                        content_parts.append(file_content)
                        content_parts.append(f"--- END OF {rel_path} ---\n")
                        
                        total_size += file_size
                        files_added += 1
                        
                    except Exception as e:
                        content_parts.append(f"\n--- ERROR reading {rel_path}: {str(e)} ---\n")
            
            if total_size > self.config["max_total_size"]:
                break
        
        # Analysis prompt
        content_parts.append("\n" + "=" * 80)
        content_parts.append("ANALYSIS REQUEST")
        content_parts.append("=" * 80)
        content_parts.append("""
Please analyze this repository and provide:

1. PROJECT OVERVIEW:
   - What does this project do?
   - What is the main technology stack?
   - What is the complexity level (Beginner/Intermediate/Advanced)?

2. LEARNING PATH:
   - Break down the project into 4-6 learning steps
   - For each step, provide:
     * Title
     * Description (what the learner will build/learn)
     * Estimated time
     * Key concepts covered
     * Specific files/components to focus on

3. TECHNICAL ANALYSIS:
   - Key technologies and frameworks used
   - Dependencies and requirements
   - Architecture patterns
   - Estimated hours to complete for different skill levels

4. LEARNING OBJECTIVES:
   - What skills will the learner gain?
   - What concepts will they understand?
   - How does this project help their development journey?

5. XP REWARD CALCULATION:
   - Based on complexity, tech stack, and learning value
   - Suggest XP reward (base: Beginner=100, Intermediate=250, Advanced=500)

Please format your response in a structured way that can be easily parsed and integrated into a learning platform.
        """)
        
        return "\n".join(content_parts)
    
    def process_repository(self, repo_url: str, output_name: str = None) -> str:
        """Main function to process a repository"""
        if not output_name:
            # Generate output name from repo URL
            repo_name = repo_url.split("/")[-1].replace(".git", "")
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_name = f"{repo_name}_{timestamp}"
        
        # Create temporary directory for cloning
        temp_dir = Path("temp_repos") / output_name
        temp_dir.parent.mkdir(exist_ok=True)
        
        try:
            print(f"🔄 Processing repository: {repo_url}")
            
            # Clone repository
            if not self.clone_repository(repo_url, str(temp_dir)):
                return ""
            
            # Extract repository information
            repo_info = self.extract_repo_info(repo_url)
            
            # Format content for LLM
            formatted_content = self.format_repo_content(temp_dir, repo_info)
            
            # Save to output file
            output_file = self.output_dir / f"{output_name}_analysis.txt"
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(formatted_content)
            
            print(f"✅ Analysis file created: {output_file}")
            print(f"📊 File size: {output_file.stat().st_size / 1024:.1f} KB")
            
            return str(output_file)
            
        except Exception as e:
            print(f"❌ Error processing repository: {str(e)}")
            return ""
        
        finally:
            # Cleanup temporary directory
            if temp_dir.exists():
                subprocess.run(["rm", "-rf", str(temp_dir)], check=True)

def main():
    parser = argparse.ArgumentParser(description="Process GitHub repository for LLM analysis")
    parser.add_argument("repo_url", help="GitHub repository URL")
    parser.add_argument("-o", "--output", help="Output file name prefix")
    parser.add_argument("-c", "--config", help="Configuration file path", default="scripts/config.json")
    
    args = parser.parse_args()
    
    processor = RepoProcessor(args.config)
    output_file = processor.process_repository(args.repo_url, args.output)
    
    if output_file:
        print(f"\n🎉 Repository analysis complete!")
        print(f"📁 Output file: {output_file}")
        print("\n📋 Next steps:")
        print("1. Review the generated analysis file")
        print("2. Copy the content and submit to your preferred LLM")
        print("3. Use the LLM's response to generate learning paths")
    else:
        print("\n❌ Repository processing failed")

if __name__ == "__main__":
    main()
