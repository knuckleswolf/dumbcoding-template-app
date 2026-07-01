import type { AxiosResponse } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { githubApiClient } from '../../github-api.api-client';
import type { Repo } from '../../types';
import { fetchRepoDetail } from '../fetch-repo-detail';

const createAxiosResponse = <TData,>(data: TData): AxiosResponse<TData> =>
  ({
    config: { headers: {} },
    data,
    headers: {},
    status: 200,
    statusText: 'OK',
  }) as AxiosResponse<TData>;

describe('fetchRepoDetail', () => {
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

  it('fetches repo detail', async () => {
    const get = vi.spyOn(githubApiClient, 'get').mockResolvedValue(createAxiosResponse(repo));

    await expect(fetchRepoDetail({ owner: 'honklab', repo: 'sambl-plugin' })).resolves.toMatchObject({
      data: repo,
    });
    expect(get).toHaveBeenCalledWith('/repos/honklab/sambl-plugin', {});
  });
});
