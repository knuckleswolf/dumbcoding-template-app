import axios from 'axios';

import { GithubApiError } from './errors';

export const createGithubApiClient = (input: { token?: string } = {}) => {
  const client = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      ...(input.token ? { Authorization: `token ${input.token}` } : {}),
    },
    validateStatus: (status) => status >= 200 && status < 300,
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      throw GithubApiError.normalize(error);
    },
  );

  return client;
};

export type GithubApiClient = ReturnType<typeof createGithubApiClient>;

export const githubApiClient = createGithubApiClient();
