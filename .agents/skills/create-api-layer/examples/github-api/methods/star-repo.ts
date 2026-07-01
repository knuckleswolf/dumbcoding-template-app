import type { AxiosRequestConfig } from 'axios';

import { githubApiClient } from '../github-api.api-client';
import { GITHUB_API_PATHS } from '../github-api.constants';
import type { StarRepoInput } from '../types';

export const starRepo = (input: StarRepoInput, config: AxiosRequestConfig = {}) =>
  githubApiClient.put<void>(GITHUB_API_PATHS.repoStar(input.owner, input.repo), undefined, config);
