const { Octokit } = require('@octokit/rest');

// octokit should be authenticated with GITHUB_TOKEN from GA
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

async function getBranch(branchName) {
  return octokit.rest.repos.getBranch({
    owner: process.env.OWNER,
    repo: 'wai-aria-practices',
    branch: branchName,
  });
}

(async () => {
  let branchName = 'apg/' + process.env.APG_BRANCH;

  try {
    // check if wai generated branch exists with branch name
    await getBranch(branchName);
  } catch (e) {
    console.info(`'${branchName}' branch not found`);

    branchName = 'apg/' + process.env.FORK_OWNER + '-' + process.env.APG_BRANCH;
    try {
      // check again if WAI generated branch exists with specially formatted
      // branch name exists (in the instance where the branch name exists
      // with the pre-pended fork owner's name)
      await getBranch(branchName);
    } catch (e) {
      console.info(`'${branchName}' branch not found`);
      process.exit();
    }
  }

  try {
    await octokit.rest.actions.createWorkflowDispatch({
      owner: process.env.OWNER,
      repo: 'wai-aria-practices',
      workflow_id: 'remove-branch.yml',
      ref: 'main',
      inputs: {
        apg_branch: process.env.APG_BRANCH,
      },
    });
    console.info('remove-branch.workflow.dispatch.success');
  } catch (e) {
    console.error('workflow.dispatch.fail', e);
    process.exit(1);
  }
})();
