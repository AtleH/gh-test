import { graphql } from '@octokit/graphql';

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

const gqlEndpoint = graphql.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
const result = await gqlEndpoint(query);

const myRepositories = result.user.contributionsCollection.commitContributionsByRepository.filter(repo => {
    const isOrganizationRepo = repo => repo.repository.owner.login === "equinor";
    const isArchived = repo => repo.repository.isArchived === true;
    const edges = repo.repository.collaborators.edges;
    const isLoggedInUser = c => c.node.login.toLowerCase() === userName.toLowerCase();
    return isOrganizationRepo(repo) && !isArchived(repo) && edges.some(isLoggedInUser);
});

console.log(myRepositories);
