import { graphql } from '@octokit/graphql';

const userName = "atleh";

const query = `
  query () {
    repositoryOwner(login: "equinor") {
      repositories(
        visibility: INTERNAL,
        last: 100,
      ) {
        nodes {
          name
          description
          catalogInfoFile: object(expression: "HEAD:catalog-info.yaml") {
            ... on Blob {
              id
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
for (const node of result.repositoryOwner.repositories.nodes) {
  console.log(node.name, node.catalogInfoFile?.id);
}
