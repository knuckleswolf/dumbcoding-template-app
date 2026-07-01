import { useMutation, useQueryClient } from '@tanstack/react-query';

import { githubApiQueryKeys } from '../github-api.query';
import { unstarRepo } from '../methods';
import type { StarRepoInput } from '../types';

export const useUnstarRepoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StarRepoInput) => unstarRepo(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: githubApiQueryKeys.repos.detail(variables.owner, variables.repo),
      });
    },
  });
};
