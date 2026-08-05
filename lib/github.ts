export async function fetchGithubActivity(githubUsername: string) {
  const headers = { Accept: 'application/vnd.github+json' };

  const userRes = await fetch(`https://api.github.com/users/${githubUsername}`, { headers });
  const user = await userRes.json();

  const reposRes = await fetch(
    `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=30`,
    { headers }
  );
  const repos = await reposRes.json();

  const repoList = Array.isArray(repos) ? repos : [];

  // Count languages across all repos
  const languageCounts: Record<string, number> = {};
  repoList.forEach((r: any) => {
    if (r.language) {
      languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
    }
  });
  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang]) => lang);

  const totalStars = repoList.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);

  return {
    avatarUrl: user.avatar_url,
    fullName: user.name || githubUsername,
    publicRepos: user.public_repos || 0,
    followers: user.followers || 0,
    totalStars,
    topLanguages,
    repos: repoList.slice(0, 10).map((r: any) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      topics: r.topics || [],
    })),
  };
}