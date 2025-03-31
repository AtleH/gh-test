import { graphql } from '@octokit/graphql';

const userName = "atleh";

const query = `
  query repositories($org: String!, $catalogPathRef: String!, $cursor: String) {
    repositoryOwner(login: $org) {
      login
      repositories(first: 5, after: $cursor) {
        nodes {
          name
          catalogInfoFile: object(expression: $catalogPathRef) {
            __typename
            ... on Blob {
              id
              text
            }
          }
          url
          isArchived
          isFork
          visibility
          repositoryTopics(first: 100) {
            nodes {
              ... on RepositoryTopic {
                topic {
                  name
                }
              }
            }
          }
          defaultBranchRef {
            name
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    rateLimit {
      limit
      remaining
      resetAt
    }
  }`;

const gqlEndpoint = graphql.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });


const result = await gqlEndpoint(query, {
  org: "equinor",
  catalogPathRef: "HEAD:catalog-info.yaml",
});
console.log(result);
