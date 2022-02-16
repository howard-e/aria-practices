const { Octokit } = require('@octokit/rest');

// octokit should be authenticated with GITHUB_TOKEN from GA
const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

(async () => {
  try {
    await octokit.rest.actions.createWorkflowDispatch({
      owner: 'howard-e',
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
