const fetchAllReposGraphQL = async (accessToken) => {
    const url = 'https://api.github.com/graphql';
    let hasNextPage = true;
    let endCursor = null;

    while (hasNextPage) {
        const query = `
        {
            repositoryOwner(login: "equinor") {
                repositories(
                    first: 100
                    ownerAffiliations: [OWNER]
                    isFork: false
                    isLocked: false
                    orderBy: { field: UPDATED_AT, direction: DESC }
                    after: ${endCursor ? `"${endCursor}"` : null}
                ) {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    nodes {
                        name
                    }
                }
            }
        }
        `;

        try {
            var startTime = performance.now()
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v4+json',
                },
                body: JSON.stringify({ query })
            });
            var endTime = performance.now()

            if (!response.ok) {
                throw new Error(`GitHub GraphQL API error: ${response.status}`);
            }

            const data = await response.json();
            if (data.errors) {
                throw new Error(`GitHub GraphQL API error: ${data.errors[0].message}`);
            }
            const repos = data.data.repositoryOwner.repositories.nodes;
            const repoNames = repos.map(repo => repo.name);
            console.log(`Reading ${repoNames.length} repos took ${(endTime - startTime).toFixed(0)} ms`);

            // Check if there are more pages
            hasNextPage = data.data.repositoryOwner.repositories.pageInfo.hasNextPage;
            endCursor = data.data.repositoryOwner.repositories.pageInfo.endCursor;
        } catch (error) {
            console.error('Error fetching repositories using GraphQL:', error);
            return;
        }
    }
};

// Replace with your personal access token
const accessToken = process.env.GITHUB_TOKEN;

fetchAllReposGraphQL(accessToken);
