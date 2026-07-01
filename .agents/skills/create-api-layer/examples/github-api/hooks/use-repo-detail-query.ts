import { useQuery } from '@tanstack/react-query';

import { repoDetailQueryOptions } from '../github-api.query';
import type { RepoDetailParams } from '../types';

export const useRepoDetailQuery = (params: RepoDetailParams) =>
  useQuery(repoDetailQueryOptions(params));
