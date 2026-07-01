import type { AxiosResponse } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { githubApiClient } from '../../github-api.api-client';
import { starRepo } from '../star-repo';

const createAxiosResponse = <TData,>(data: TData): AxiosResponse<TData> =>
  ({
    config: { headers: {} },
    data,
    headers: {},
    status: 200,
    statusText: 'OK',
  }) as AxiosResponse<TData>;

describe('starRepo', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('stars a repo', async () => {
    const put = vi.spyOn(githubApiClient, 'put').mockResolvedValue(createAxiosResponse(undefined));

    await expect(starRepo({ owner: 'honklab', repo: 'sambl-plugin' })).resolves.toMatchObject({
      data: undefined,
    });
    expect(put).toHaveBeenCalledWith('/user/starred/honklab/sambl-plugin', undefined, {});
  });
});
