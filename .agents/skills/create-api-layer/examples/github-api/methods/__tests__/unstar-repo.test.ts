import type { AxiosResponse } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { githubApiClient } from '../../github-api.api-client';
import { unstarRepo } from '../unstar-repo';

const createAxiosResponse = <TData,>(data: TData): AxiosResponse<TData> =>
  ({
    config: { headers: {} },
    data,
    headers: {},
    status: 200,
    statusText: 'OK',
  }) as AxiosResponse<TData>;

describe('unstarRepo', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('unstars a repo', async () => {
    const remove = vi
      .spyOn(githubApiClient, 'delete')
      .mockResolvedValue(createAxiosResponse(undefined));

    await expect(unstarRepo({ owner: 'honklab', repo: 'sambl-plugin' })).resolves.toMatchObject({
      data: undefined,
    });
    expect(remove).toHaveBeenCalledWith('/user/starred/honklab/sambl-plugin', {});
  });
});
