import { graphql } from '@octokit/graphql';

const userName = "atleh";

const query = `
  query ($cursor: String) {
    repositoryOwner(login: "equinor") {
      repositories(
        visibility: INTERNAL,
        first: 5,
        after: $cursor
      ) {
        nodes {
          name
          description
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

let cursor = null;
let hasNextPage = true;

let i = 0;
while (hasNextPage) {
  const result = await gqlEndpoint(query, { cursor });
  for (const node of result.repositoryOwner.repositories.nodes) {
    console.log(node.name, node.description);
  }
  console.log(result.repositoryOwner.repositories.pageInfo);

  cursor = result.repositoryOwner.repositories.pageInfo.endCursor;
  hasNextPage = result.repositoryOwner.repositories.pageInfo.hasNextPage;
  i++;
  if (i > 5) {
    break;
  }
}
