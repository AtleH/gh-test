import { graphql } from '@octokit/graphql';

const userName = "atleh";

const query = `
  query ($repoName: String!) {
    repositoryOwner(login: "equinor") {
      repository(name: $repoName) {
          name
          description
          nonExistingFile: object(expression: "HEAD:non-existing.yaml") {
            ... on Blob {
              id
            }
          }
          catalogInfoFile: object(expression: "HEAD:catalog-info.yaml") {
            ... on Blob {
              id
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


const result = await gqlEndpoint(query, {repoName: "backstage"});
console.log(result);
// for (const node of result.repositoryOwner.repositories.nodes) {
//   console.log(node);
// }

