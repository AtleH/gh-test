import { Octokit, App } from "octokit";

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const query = `{
    viewer {
      login
    }
  }`;
// Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
const {
    viewer: { login },
  } = await octokit.graphql(query);

  console.log("Hello, %s", login);
