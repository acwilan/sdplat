const { execSync } = require('child_process');
const fs = require('fs');

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const commitId = execSync('git rev-parse HEAD').toString().trim();

fs.writeFileSync('gitInfo.json', JSON.stringify({ branch, commitId }));
