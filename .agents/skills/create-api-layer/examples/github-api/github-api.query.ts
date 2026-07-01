import { queryOptions } from '@tanstack/react-query';

import { fetchRepoDetail, fetchRepos } from './methods';
import type { RepoDetailParams, RepoListParams } from './types';

export const githubApiQueryKeys = {
  all: ['githubApi'] as const,
  repos: {
    all: () => [...githubApiQueryKeys.all, 'repos'] as const,
    byUser: (owner: string) => [...githubApiQueryKeys.repos.all(), 'user', owner] as const,
    detail: (owner: string, repo: string) =>
      [...githubApiQueryKeys.repos.all(), 'detail', owner, repo] as const,
  },
};

export const reposQueryOptions = (params: RepoListParams) =>
  queryOptions({
    queryKey: githubApiQueryKeys.repos.byUser(params.owner),
    queryFn: async ({ signal }) => {
      const response = await fetchRepos(params, { signal });
      return response.data;
    },
  });

export const repoDetailQueryOptions = (params: RepoDetailParams) =>
  queryOptions({
    queryKey: githubApiQueryKeys.repos.detail(params.owner, params.repo),
    queryFn: async ({ signal }) => {
      const response = await fetchRepoDetail(params, { signal });
      return response.data;
    },
  });
