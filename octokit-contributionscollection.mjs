import { Octokit, App } from "octokit";

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const query = `
{
  user(login: "atleh") {
    contributionsCollection {
      commitContributionsByRepository(maxRepositories: 100) {
        repository {
          name
          owner {
            login
          }
        }
      }
    }
  }
}
`;

  // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
const {
    user: { contributionsCollection },
  } = await octokit.graphql(query);

for (const repo of contributionsCollection.commitContributionsByRepository) {
    console.log(repo);
}
