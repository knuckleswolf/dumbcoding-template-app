/**
 * GitHub API types
 */

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
  };
  description: string | null;
  url: string;
  html_url: string;
  stars_count: number;
  language: string | null;
  updated_at: string;
}

export interface RepoListParams {
  owner: string;
  per_page?: number;
  page?: number;
}

export interface RepoDetailParams {
  owner: string;
  repo: string;
}

export interface StarRepoInput {
  owner: string;
  repo: string;
}
