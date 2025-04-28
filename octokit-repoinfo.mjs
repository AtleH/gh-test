import { graphql } from '@octokit/graphql';

const userName = "atleh";

const query = `
query repositories($org: String!, $name: String!) {
  repository(owner: $org, name: $name) {
      name
      nameWithOwner
      collaborators(first: 10) {
        nodes {
          login
          name
          url
          avatarUrl
        }
        edges {
          permission
          node {
            login
            name
            url
            avatarUrl
          }
        }
      }
    }
 }
`;

const filterAdmins = (collaborators) => {
  return collaborators.edges
    .filter(edge => edge.permission === "ADMIN")
    .map(edge => edge.node);
};

const gqlEndpoint = graphql.defaults({
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

const result = await gqlEndpoint(query, { org: "equinor", name: "apprentice" });
  const filtered = filterAdmins(result.repository.collaborators);
  console.log(result.repository);
  console.log(filtered);
  console.log(result.repository.collaborators.edges);

