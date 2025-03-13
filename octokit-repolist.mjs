import { graphql } from '@octokit/graphql';

const userName = "atleh";

const query = `
{
  repositoryOwner(login:"equinor") {
    repositories(
      first:5
    )
    {nodes {
      name
        collaborators(first: 10) {
          nodes {
            login
            name
          }
          edges {
            permission
          }
        }
      }
    }
  }
}`;

const gqlEndpoint = graphql.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
const result = await gqlEndpoint(query);
for (const repo of result.repositoryOwner.repositories.nodes) {
    console.log(repo.name);
    const collaborators = repo.collaborators.nodes.map((node, index) => ({
      ...node,
      permission: repo.collaborators.edges[index]?.permission
    }));
    const filtered = collaborators.filter(collaborator =>
      (collaborator.permission === 'ADMIN' && collaborator.name !== 'Equinor Admin' && collaborator.name !== 'Equinor-Admin')
    );
    for (const collaborator of collaborators) {
      console.log(`  ${collaborator.name} (${collaborator.login}) - ${collaborator.permission}`);
    }
}
// console.log(result.repositoryOwner.repositories.nodes);
// const myRepositories = result.repositories.nodes.filter(repo => {
//     const isOrganizationRepo = repo => repo.repository.owner.login === "equinor";
//     const isArchived = repo => repo.repository.isArchived === true;
//     const isLoggedInUser = c => c.node.login.toLowerCase() === userName.toLowerCase();
//     const collaborators = repo.repository.collaborators.edges;
//     return isOrganizationRepo(repo) && !isArchived(repo) && collaborators.some(isLoggedInUser);
// });

// console.log(myRepositories);
