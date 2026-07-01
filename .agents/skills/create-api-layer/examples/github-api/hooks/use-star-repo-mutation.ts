import { useMutation, useQueryClient } from '@tanstack/react-query';

import { githubApiQueryKeys } from '../github-api.query';
import { starRepo } from '../methods';
import type { StarRepoInput } from '../types';

export const useStarRepoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StarRepoInput) => starRepo(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: githubApiQueryKeys.repos.detail(variables.owner, variables.repo),
      });
    },
  });
};
