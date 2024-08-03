const GITHUB_API_URL = 'https://api.github.com/repos/';
let leaderboardData = [];

async function fetchRepositoryDetails(repoUrl) {
    const repoName = repoUrl.split('github.com/')[1];
    console.log(`Fetching data for repo: ${repoName}`);
    const repoResponse = await fetch(`${GITHUB_API_URL}${repoName}`);
    const repoData = await repoResponse.json();
    console.log('Repo data:', repoData);

    const contributorsResponse = await fetch(`${GITHUB_API_URL}${repoName}/contributors`);
    const contributorsData = await contributorsResponse.json();
    console.log('Contributors data:', contributorsData);

    return contributorsData.map(contributor => ({
        username: contributor.login,
        contributions: contributor.contributions,
        avatar_url: contributor.avatar_url
    }));
}

async function addRepository(repoUrl) {
    if (repoUrl) {
        const contributors = await fetchRepositoryDetails(repoUrl);
        leaderboardData = [...contributors];
        console.log('Updated leaderboard data:', leaderboardData);
        updateLeaderboard();
    }
}


function updateLeaderboard() {
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '';

    leaderboardData.sort((a, b) => b.contributions - a.contributions);

    leaderboardData.forEach((contributor, index) => {
        const contributorElement = document.createElement('div');
        contributorElement.className = index === 0 ? 'highlighted-item' : 'leaderboard-item';

        contributorElement.innerHTML = `
            <img src="${contributor.avatar_url}" alt="${contributor.username}">
            <div class="details">
                <h2>${contributor.username}</h2>
                <p>Points: ${contributor.contributions}</p>
            </div>
        `;
        
        leaderboardElement.appendChild(contributorElement);
    });
}

function loadProfileImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const output = document.getElementById('profile-image');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}


function logout() {
    
    alert('Logged out');
}

// tHIS was the rest function i was talking about
async function testKnownRepo() {
    const testRepoUrl = 'https://github.com/octocat/Hello-World';
    await addRepository(testRepoUrl);
}

// Call the test function
testKnownRepo();
