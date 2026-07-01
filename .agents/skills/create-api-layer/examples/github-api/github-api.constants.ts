export const GITHUB_API_PATHS = {
  reposByUser: (owner: string) => `/users/${owner}/repos`,
  repoDetail: (owner: string, repo: string) => `/repos/${owner}/${repo}`,
  repoStar: (owner: string, repo: string) => `/user/starred/${owner}/${repo}`,
};
