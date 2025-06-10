// GitHub API URL
const GITHUB_API_URL = 'https://api.github.com/users/';

// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const infoBtn = document.getElementById('infoBtn');
const usernameInput = document.getElementById('usernameInput');
const resultContainer = document.getElementById('resultContainer');
const infoSection = document.getElementById('infoSection');
const factsContainer = document.getElementById('factsContainer');

// Extended random facts about GitHub and programming
const randomFacts = [
    "GitHub was launched in April 2008 and now has over 100 million developers.",
    "The first line of code was written in 1843 by Ada Lovelace for Charles Babbage's Analytical Engine.",
    "JavaScript was created in just 10 days in 1995 by Brendan Eich.",
    "Linux kernel is the largest Git repository with over 27 million lines of code (as of 2021).",
    "GitHub was acquired by Microsoft in 2018 for $7.5 billion.",
    "There are over 700 programming languages in existence today.",
    "Python is named after Monty Python, not the snake. Its creator was a fan of the comedy group.",
    "The first computer virus was created in 1983 by Fred Cohen as a security experiment.",
    "NASA still uses code from the 1970s in their spacecraft systems.",
    "Approximately 70% of GitHub's active users are outside the United States.",
    "The original GitHub logo was designed to look like an octocat - a cat with octopus tentacles.",
    "Stack Overflow has over 21 million questions and is visited by 100 million people monthly.",
    "The most starred repository on GitHub is 'freeCodeCamp' with over 370k stars.",
    "The first website (info.cern.ch) is still online today, created by Tim Berners-Lee in 1991.",
    "Git was created by Linus Torvalds in 2005 for development of the Linux kernel."
];

// Display random facts
function displayRandomFacts() {
    factsContainer.innerHTML = '';

    // Shuffle the facts array
    const shuffledFacts = [...randomFacts].sort(() => 0.5 - Math.random());

    // Take the first 6 facts
    const selectedFacts = shuffledFacts.slice(0, 6);

    selectedFacts.forEach(fact => {
        const factCard = document.createElement('div');
        factCard.className = 'fact-card';
        factCard.innerHTML = `
            <h3><i class="fas fa-star"></i> Did You Know?</h3>
            <p>${fact}</p>
        `;
        factsContainer.appendChild(factCard);
    });
}

// Fetch GitHub profile data
async function fetchGitHubProfile(username) {
    try {
        // Show loading state
        resultContainer.innerHTML = '<div class="loading">Loading profile data...</div>';
        resultContainer.style.display = 'block';

        const response = await fetch(`${GITHUB_API_URL}${username}`);
        if (!response.ok) {
            throw new Error('User not found - please check the username');
        }
        const data = await response.json();

        // Fetch user repositories
        const reposResponse = await fetch(data.repos_url);
        const reposData = await reposResponse.json();

        displayProfile(data, reposData);
    } catch (error) {
        resultContainer.innerHTML = `
            <div class="error-message">
                <h3><i class="fas fa-exclamation-triangle"></i> Error: ${error.message}</h3>
                <p>Please check the username and try again</p>
            </div>
        `;
        resultContainer.style.display = 'block';
    }
}

// Display GitHub profile with extended information
function displayProfile(profile, repos) {
    // Sort repositories by star count
    const topRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);

    // Format dates
    const createdAt = new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const updatedAt = new Date(profile.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    resultContainer.innerHTML = `
        <div class="profile-header">
            <div class="avatar">
                <img src="${profile.avatar_url}" alt="${profile.login}">
            </div>
            <div class="profile-info">
                <h1 class="profile-name">
                    ${profile.name || profile.login}
                    ${profile.site_admin ? '<span class="badge"><i class="fas fa-shield-alt"></i> Admin</span>' : ''}
                </h1>
                <h2 class="profile-username">@${profile.login}</h2>
                <p class="profile-bio">${profile.bio || 'This user has not added a bio yet.'}</p>
                <div class="profile-stats">
                    <div class="stat">
                        <div class="stat-value">${profile.public_repos}</div>
                        <div class="stat-label">Repositories</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${profile.followers}</div>
                        <div class="stat-label">Followers</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${profile.following}</div>
                        <div class="stat-label">Following</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${profile.public_gists}</div>
                        <div class="stat-label">Gists</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="profile-details">
            <div class="detail-card">
                <h3><i class="fas fa-user-circle"></i> Personal Information</h3>
                <p><strong>Full Name:</strong> ${profile.name || 'Not specified'}</p>
                <p><strong>Company:</strong> ${profile.company || 'Not specified'}</p>
                <p><strong>Location:</strong> ${profile.location || 'Not specified'}</p>
                <p><strong>Email:</strong> ${profile.email ? `<a href="mailto:${profile.email}">${profile.email}</a>` : 'Not specified'}</p>
                <p><strong>Hireable:</strong> ${profile.hireable ? 'Yes' : 'No'}</p>
            </div>

            <div class="detail-card">
                <h3><i class="fas fa-link"></i> Online Presence</h3>
                <p><strong>Blog/Website:</strong> ${profile.blog ? `<a href="${profile.blog}" target="_blank">${profile.blog}</a>` : 'Not specified'}</p>
                <p><strong>Twitter:</strong> ${profile.twitter_username ? `<a href="https://twitter.com/${profile.twitter_username}" target="_blank">@${profile.twitter_username}</a>` : 'Not specified'}</p>
                <p><strong>GitHub Profile:</strong> <a href="${profile.html_url}" target="_blank">${profile.html_url}</a></p>
            </div>

            <div class="detail-card">
                <h3><i class="fas fa-calendar-alt"></i> Account Details</h3>
                <p><strong>Account Created:</strong> ${createdAt}</p>
                <p><strong>Last Updated:</strong> ${updatedAt}</p>
                <p><strong>Type:</strong> ${profile.type}</p>
            </div>
        </div>

        <h2 class="section-title"><i class="fas fa-book"></i> Top Repositories</h2>
        <div class="repos-container">
            ${topRepos.map(repo => `
                <div class="repo-card">
                    <h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4>
                    <p>${repo.description || 'No description provided'}</p>
                    <div class="repo-meta">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        <span><i class="fas fa-circle" style="color: ${repo.language ? '#238636' : '#8b949e'}"></i> ${repo.language || 'N/A'}</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <h2 class="section-title"><i class="fas fa-chart-line"></i> Activity Overview</h2>
        <div class="profile-details">
            <div class="detail-card">
                <h3><i class="fas fa-history"></i> Recent Activity</h3>
                <p>Last repository update: ${new Date(profile.updated_at).toLocaleDateString()}</p>
                <p>Most active language: ${getMostUsedLanguage(topRepos) || 'N/A'}</p>
                <p>Total repository size: ${calculateTotalRepoSize(repos).toFixed(2)} MB</p>
            </div>

            <div class="detail-card">
                <h3><i class="fas fa-trophy"></i> Repository Stats</h3>
                <p>Average stars: ${(topRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0) / topRepos.length).toFixed(1)}</p>
                <p>Total stars: ${topRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}</p>
                <p>Total forks: ${topRepos.reduce((sum, repo) => sum + repo.forks_count, 0)}</p>
            </div>
        </div>
    `;
    resultContainer.style.display = 'block';
}

// Helper function to get most used language
function getMostUsedLanguage(repos) {
    const languages = {};
    repos.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });

    let maxCount = 0;
    let mostUsed = null;

    for (const [lang, count] of Object.entries(languages)) {
        if (count > maxCount) {
            maxCount = count;
            mostUsed = lang;
        }
    }

    return mostUsed;
}

// Helper function to calculate total repo size
function calculateTotalRepoSize(repos) {
    const totalKB = repos.reduce((sum, repo) => sum + repo.size, 0);
    return totalKB / 1024; // Convert to MB
}

// Clear search results
function clearResults() {
    resultContainer.style.display = 'none';
    usernameInput.value = '';
    usernameInput.focus();
}

// Toggle info section
function toggleInfoSection() {
    if (infoSection.style.display === 'block') {
        infoSection.style.display = 'none';
        resultContainer.style.display = 'none';
    } else {
        infoSection.style.display = 'block';
        resultContainer.style.display = 'none';
        displayRandomFacts();
    }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        fetchGitHubProfile(username);
        infoSection.style.display = 'none';
    }
});

clearBtn.addEventListener('click', clearResults);

infoBtn.addEventListener('click', toggleInfoSection);

usernameInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayRandomFacts();
    usernameInput.focus();
});
