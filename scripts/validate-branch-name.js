import { execSync } from 'child_process';

// Retrieve the branch name without considering script arguments
const branchName = execSync('git symbolic-ref --short HEAD').toString().trim();

const branchRegex = /^(feature|bugfix|hotfix|chore)\/(SCRM|QWL)-\d+$/;

console.log(`Branch Name: "${branchName}"`);

if (!branchRegex.test(branchName)) {
  console.error(`\nERROR: Invalid branch name "${branchName}".\nBranch names must follow the pattern: feature/SCRM-xxx, bugfix/SCRM-xxx, hotfix/SCRM-xxx, or chore/SCRM-xxx.\n`);
  process.exit(1);
} else {
  console.log('Branch name is valid.');
}
