import { AxiosError } from 'axios';

/**
 * GitHub API error normalization
 */
export class GithubApiError extends Error {
  constructor(
    public code: string,
    public status?: number,
    public original?: AxiosError
  ) {
    super(`[${code}] GitHub API error`);
    this.name = 'GithubApiError';
  }

  static normalize(error: unknown): GithubApiError {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const code = status === 404 ? 'NOT_FOUND' : status === 403 ? 'FORBIDDEN' : 'API_ERROR';
      return new GithubApiError(code, status, error);
    }
    return new GithubApiError('UNKNOWN', undefined);
  }
}

export function assertGithubApiError(error: unknown): asserts error is GithubApiError {
  if (!(error instanceof GithubApiError)) {
    throw new Error('Expected GithubApiError');
  }
}
