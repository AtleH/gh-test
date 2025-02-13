import { Octokit } from "octokit";

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const query = `
{
  user(login: "atleh") {
    contributionsCollection (
      from: "2021-01-01T00:00:00Z"
      to: "2021-12-31T23:59:59Z"
    )
    {
      commitContributionsByRepository(
        maxRepositories: 100) {
        repository {
          name
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

const equinorRepos = contributionsCollection.commitContributionsByRepository.filter(repo => repo.repository.owner.login === "equinor");

const whereIAmAdmin = equinorRepos.filter(repo => {
    const edges = repo.repository.collaborators.edges;
    const isMe = collaborator => collaborator.node.login.toLowerCase() === "atleh";
    const isAdmin = collaborator => collaborator.permission === "ADMIN";
    return edges.some(c => isMe(c) && isAdmin(c));
});

for (const repo of whereIAmAdmin) {
    console.log(repo.repository.name);
}
