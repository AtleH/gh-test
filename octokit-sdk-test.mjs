import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const PAGING_SIZE = 100;
async function getAdminRepos(org) {

  let repos = [];
  let page = 1;

  try {
    while (true) {
      const response = await octokit.repos.listForAuthenticatedUser({
        org,
        per_page: PAGING_SIZE, // Max per request
        affiliation: 'owner',
        page,
      });

      // Filter repos where you have admin access
      const adminRepos = response.data.filter(repo => repo.permissions.admin);
      const adminRepoNames = adminRepos.map(repo => repo.name);
      console.log(adminRepoNames);
      repos = repos.concat(adminRepoNames);

      if (response.data.length < PAGING_SIZE) break; // No more pages
      page++;
    }

    console.log(`You have admin access to ${repos.length} repositories:`);
    repos.forEach(repo => console.log(repo));
  } catch (error) {
    console.error("Error fetching repositories:", error);
  }
}

// Replace with your organization name
getAdminRepos("Equinor");
