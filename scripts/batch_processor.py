
#!/usr/bin/env python3
"""
Batch Repository Processor
Process multiple repositories at once
"""

import json
import sys
from pathlib import Path
from repo_processor import RepoProcessor

def load_repo_list(file_path: str):
    """Load repository list from JSON file"""
    with open(file_path, 'r') as f:
        return json.load(f)

def process_batch(repo_list_file: str, config_file: str = "scripts/config.json"):
    """Process multiple repositories in batch"""
    processor = RepoProcessor(config_file)
    
    try:
        repos = load_repo_list(repo_list_file)
        results = []
        
        print(f"🚀 Starting batch processing of {len(repos)} repositories...")
        
        for i, repo in enumerate(repos, 1):
            repo_url = repo.get('url') or repo.get('repo_url')
            repo_name = repo.get('name') or repo_url.split('/')[-1].replace('.git', '')
            
            print(f"\n📦 Processing {i}/{len(repos)}: {repo_name}")
            
            output_file = processor.process_repository(repo_url, repo_name)
            
            result = {
                'repo_name': repo_name,
                'repo_url': repo_url,
                'output_file': output_file,
                'success': bool(output_file)
            }
            
            results.append(result)
        
        # Save batch results
        results_file = Path("output") / "batch_results.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n✅ Batch processing complete!")
        print(f"📊 Results: {sum(1 for r in results if r['success'])}/{len(results)} successful")
        print(f"📁 Results saved to: {results_file}")
        
    except Exception as e:
        print(f"❌ Batch processing failed: {str(e)}")

def main():
    if len(sys.argv) != 2:
        print("Usage: python batch_processor.py <repo_list.json>")
        print("\nExample repo_list.json format:")
        print("""[
  {"name": "awesome-project", "url": "https://github.com/user/awesome-project"},
  {"name": "cool-app", "url": "https://github.com/user/cool-app"}
]""")
        sys.exit(1)
    
    process_batch(sys.argv[1])

if __name__ == "__main__":
    main()
