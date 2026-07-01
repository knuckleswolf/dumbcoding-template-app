import type { AxiosResponse } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { githubApiClient } from '../../github-api.api-client';
import type { Repo } from '../../types';
import { fetchRepos } from '../fetch-repos';

const createAxiosResponse = <TData,>(data: TData): AxiosResponse<TData> =>
  ({
    config: { headers: {} },
    data,
    headers: {},
    status: 200,
    statusText: 'OK',
  }) as AxiosResponse<TData>;

describe('fetchRepos', () => {
  const repo: Repo = {
    id: 1,
    name: 'sambl-plugin',
    full_name: 'honklab/sambl-plugin',
    owner: {
      login: 'honklab',
      id: 10,
      avatar_url: 'https://example.com/avatar.png',
    },
    description: 'Plugin repository',
    url: 'https://api.github.com/repos/honklab/sambl-plugin',
    html_url: 'https://github.com/honklab/sambl-plugin',
    stars_count: 42,
    language: 'TypeScript',
    updated_at: '2026-06-25T00:00:00Z',
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches repos by owner', async () => {
    const get = vi.spyOn(githubApiClient, 'get').mockResolvedValue(createAxiosResponse([repo]));

    await expect(fetchRepos({ owner: 'honklab', per_page: 10, page: 2 })).resolves.toMatchObject({
      data: [repo],
    });
    expect(get).toHaveBeenCalledWith('/users/honklab/repos', {
      params: {
        page: 2,
        per_page: 10,
      },
    });
  });
});
