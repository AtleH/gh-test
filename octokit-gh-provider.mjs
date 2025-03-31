import { graphql } from '@octokit/graphql';

const userName = "atleh";

const query = `
  query repositories($org: String!, $catalogPathRef: String!, $cursor: String) {
    repositoryOwner(login: $org) {
      login
      repositories(first: 100, after: $cursor) {
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

let cursor = null;
let hasNextPage = true;
let pageNo = 1;

while (hasNextPage) {
  console.log(`Page ${pageNo}`);
  const result = await gqlEndpoint(query, {
    org: "equinor",
    catalogPathRef: "HEAD:catalog-info.yaml",
    cursor: cursor,
  });
  cursor = result.repositoryOwner.repositories.pageInfo.endCursor;
  hasNextPage = result.repositoryOwner.repositories.pageInfo.hasNextPage && pageNo++ < 5;
  console.log(result);
}
