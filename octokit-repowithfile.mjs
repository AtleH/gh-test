import { graphql } from '@octokit/graphql';

const userName = "atleh";

const query = `
  query () {
    repositoryOwner(login: "equinor") {
      repositories(
        visibility: INTERNAL,
        first: 3,
      ) {
        nodes {
          name
          description
          object(expression: "HEAD:README.md") {
            ... on Blob {
              id
            }
          }
          packageJson: object(expression: "HEAD:package.json") {
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
  console.log(node);
}

