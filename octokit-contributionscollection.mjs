import { Octokit } from "octokit";

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const userName = "atleh";

const query = `
{
  user(login: "${userName}") {
    contributionsCollection
    {
      commitContributionsByRepository(
        maxRepositories: 100) {
        repository {
          name
          isArchived
          description
          collaborators {
            edges {node {login} permission}
          }
          owner {
            login
          }
        }
      }
    }
  }
}
`;

const {
    user: { contributionsCollection },
  } = await octokit.graphql(query);

const myRepositories = contributionsCollection.commitContributionsByRepository.filter(repo => {
    const isOrganizationRepo = repo => repo.repository.owner.login === "equinor";
    const isArchived = repo => repo.repository.isArchived === true;
    const edges = repo.repository.collaborators.edges;
    const isLoggedInUser = c => c.node.login.toLowerCase() === userName.toLowerCase();
    return isOrganizationRepo(repo) && !isArchived(repo) && edges.some(isLoggedInUser);
});

console.log(myRepositories);
