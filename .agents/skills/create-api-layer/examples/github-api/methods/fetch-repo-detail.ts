import type { AxiosRequestConfig } from 'axios';

import { githubApiClient } from '../github-api.api-client';
import { GITHUB_API_PATHS } from '../github-api.constants';
import type { Repo, RepoDetailParams } from '../types';

export const fetchRepoDetail = (params: RepoDetailParams, config: AxiosRequestConfig = {}) =>
  githubApiClient.get<Repo>(GITHUB_API_PATHS.repoDetail(params.owner, params.repo), config);
