
# Repository Processor for LLM Analysis

This script processes GitHub repositories and formats them for LLM analysis to generate learning paths.

## Features

- Clones GitHub repositories
- Filters and formats codebase content
- Respects .gitignore patterns and file size limits
- Generates structured prompts for LLM analysis
- Supports batch processing of multiple repositories
- Configurable file filtering and size limits

## Setup

1. Install dependencies:
```bash
pip install -r scripts/requirements.txt
```

2. Make sure you have `git` installed and accessible in your PATH.

## Usage

### Single Repository Processing

```bash
# Basic usage
python scripts/repo_processor.py https://github.com/user/repo

# With custom output name
python scripts/repo_processor.py https://github.com/user/repo -o my_analysis

# With custom config
python scripts/repo_processor.py https://github.com/user/repo -c my_config.json
```

### Batch Processing

1. Create a JSON file with repository list:
```json
[
  {"name": "project1", "url": "https://github.com/user/project1"},
  {"name": "project2", "url": "https://github.com/user/project2"}
]
```

2. Run batch processor:
```bash
python scripts/batch_processor.py repo_list.json
```

## Configuration

Edit `scripts/config.json` to customize:

- `ignore_patterns`: File patterns to ignore
- `include_extensions`: File extensions to include
- `max_file_size`: Maximum individual file size (bytes)
- `max_total_size`: Maximum total content size (bytes)

## Output

The script generates:
- Formatted analysis files in the `output/` directory
- Repository structure overview
- File contents with proper formatting
- Analysis prompts for LLM submission

## Integration with Your App

You can integrate this with your existing GitHub analysis by:

1. Running the script to generate analysis files
2. Submitting the content to your preferred LLM
3. Parsing the LLM response to update your database
4. Using the generated learning paths in your Builder/Learner interface

## Example Workflow

1. **Process Repository:**
   ```bash
   python scripts/repo_processor.py https://github.com/facebook/react
   ```

2. **Submit to LLM:**
   - Copy content from `output/react_YYYYMMDD_HHMMSS_analysis.txt`
   - Paste into ChatGPT, Claude, or your preferred LLM
   - Get structured analysis and learning path

3. **Update Your App:**
   - Parse the LLM response
   - Update your repository analysis in `lib/github.ts`
   - Display new learning paths in your Learner interface

## Tips

- Start with smaller repositories to test the workflow
- Adjust file size limits in config.json based on your LLM's token limits
- Use batch processing for multiple repositories from the same user
- Save LLM responses to build a database of analyses
