import { Octokit, App } from "octokit";

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const query = `
{
    repositoryOwner(login: "equinor") {
        repositories(
            first: 100
            ownerAffiliations: [OWNER]
            isFork: false
            isLocked: false
            orderBy: { field: UPDATED_AT, direction: DESC }
        ) {
            pageInfo {
                hasNextPage
                endCursor
            }
            nodes {
                name
            }
        }
    }
}
`;

  // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
const {
    repositoryOwner: { repositories },
  } = await octokit.graphql(query);

  console.log(repositories);
