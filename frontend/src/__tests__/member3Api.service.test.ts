import { beforeEach, describe, expect, it, vi } from 'vitest';

const apiGet = vi.hoisted(() => vi.fn());

vi.mock('../services/api', () => ({
  default: { get: apiGet },
}));

import { clearMember3Cache, getMember3Resource } from '../services/member3Api.service';

describe('getMember3Resource', () => {
  beforeEach(() => {
    clearMember3Cache();
    apiGet.mockReset();
  });

  it('shares an in-flight request and reuses its successful response', async () => {
    let resolveResponse!: (value: { data: { data: { score: number } } }) => void;
    apiGet.mockReturnValue(
      new Promise<{ data: { data: { score: number } } }>((resolve) => {
        resolveResponse = resolve;
      })
    );

    const first = getMember3Resource<{ score: number }>('/analytics');
    const second = getMember3Resource<{ score: number }>('/analytics');

    expect(apiGet).toHaveBeenCalledTimes(1);

    resolveResponse({ data: { data: { score: 82 } } });
    await expect(first).resolves.toEqual({ score: 82 });
    await expect(second).resolves.toEqual({ score: 82 });
    await expect(getMember3Resource<{ score: number }>('/analytics')).resolves.toEqual({ score: 82 });
    expect(apiGet).toHaveBeenCalledTimes(1);
  });
});
