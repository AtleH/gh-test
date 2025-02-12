import { Octokit, App } from "octokit";

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const query = `
{
    viewer {
        topRepositories(
            first: 100
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

const {
    viewer: { topRepositories },
  } = await octokit.graphql(query);

  console.log(topRepositories);
