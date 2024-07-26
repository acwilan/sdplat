const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to gitInfo.json
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
  process.env.SOURCE_VERSION || 'unknown');

// Read version from package.json
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version || 'unknown';

// Get the current date as the build date
const buildDate = new Date().toISOString();

// Write the git info, version, and build date to a file
fs.writeFileSync(gitInfoPath, JSON.stringify({ branch, commitId, version, buildDate }));
