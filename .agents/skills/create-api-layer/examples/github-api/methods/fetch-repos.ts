import type { AxiosRequestConfig } from 'axios';

import { githubApiClient } from '../github-api.api-client';
import { GITHUB_API_PATHS } from '../github-api.constants';
import type { Repo, RepoListParams } from '../types';

export const fetchRepos = (params: RepoListParams, config: AxiosRequestConfig = {}) =>
  githubApiClient.get<Array<Repo>>(GITHUB_API_PATHS.reposByUser(params.owner), {
    ...config,
    params: {
      ...config.params,
      page: params.page ?? 1,
      per_page: params.per_page ?? 30,
    },
  });
