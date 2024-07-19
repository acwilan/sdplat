const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const gitInfoPath = path.resolve(__dirname, '../gitInfo.json');

// Function to execute a git command and return the result, or default if it fails
const getGitInfo = (command, defaultValue) => {
  try {
    return execSync(command).toString().trim();
  } catch (error) {
    console.warn(`Failed to get git info: ${command}, using default value: ${defaultValue}`);
    return defaultValue;
  }
};

// Get branch and commit ID or use defaults
const branch = getGitInfo('git rev-parse --abbrev-ref HEAD', 
    process.env.HEROKU_APP_NAME || 'feature branch');
const commitId = getGitInfo('git rev-parse HEAD', 
    process.env.HEROKU_SLUG_COMMIT || 'unknown');

// Write the git info to a file
fs.writeFileSync(gitInfoPath, JSON.stringify({ branch, commitId }));
