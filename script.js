// @ts-check

/** @type boolean */
let hasDeleteRepoScope;

/**
 * An Octoherd script to delete repositories
 *
 * @param {import('@octoherd/cli').Octokit} octokit
 * @param {import('@octoherd/cli').Repository} repository
 */
export async function script(octokit, repository) {
  if (!hasDeleteRepoScope) {
    const { headers } = await octokit.request("HEAD /");
    const scopes = new Set(headers["x-oauth-scopes"].split(", "));

    if (!scopes.has("delete_repo")) {
      throw new Error(
        `The "delete_repo" scope is required for this script. Create a token at https://github.com/settings/tokens/new?scopes=delete_repo then run the script with "-T <paste token here>"`
      );
    }
    hasDeleteRepoScope = true;
  }

  await octokit.request("DELETE /repos/{owner}/{repo}", {
    owner: repository.owner.login,
    repo: repository.name,
  });
  octokit.log.info("Repository deleted");
}
