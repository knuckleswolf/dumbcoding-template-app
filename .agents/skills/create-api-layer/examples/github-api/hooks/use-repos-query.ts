import { useQuery } from '@tanstack/react-query';

import { reposQueryOptions } from '../github-api.query';
import type { RepoListParams } from '../types';

export const useReposQuery = (params: RepoListParams) => useQuery(reposQueryOptions(params));
