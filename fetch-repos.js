const fetchRepos = async (username, accessToken) => {
    const url = `https://api.github.com/graphql`;
    const query = `
    {
        user(login: "${username}") {
            repositories(first: 10) {
                nodes {
                    name
                }
            }
        }
    }
    `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `token ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({query})
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        if (!response.ok) {
            throw new Error(`GitHub GraphQL API error: ${response.status}`);
        }

        const data = await response.json();
        const repos = data.data.user.repositories.nodes;

        if (repos.length === 0) {
            console.log(`No repositories found for user: ${username}`);
        } else {
            repos.forEach(repo => console.log(repo.name));
        }    } catch (error) {
        console.error('Error fetching repositories:', error);
    }
};

// Replace with your GitHub username and personal access token
const username = 'atleh';
const accessToken = process.env.GITHUB_TOKEN;

fetchRepos(username, accessToken);
