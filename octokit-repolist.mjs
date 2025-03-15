import { graphql } from '@octokit/graphql';

const userName = "atleh";

const query = `
{
  repositoryOwner(login: "equinor") {
    repositories(
      visibility: INTERNAL,
      first: 5,
    ) {
      nodes {
        name
      }
      pageInfo {
        endCursor
        hasNextPage
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
for (const node of result.repositoryOwner.repositories.nodes) {
  console.log(node.name);
}
console.log(result.repositoryOwner.repositories.pageInfo);
