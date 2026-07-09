import { client } from './client';
import type { StatisticResponse } from './types';

export async function getStatistic(from: string, to: string): Promise<StatisticResponse> {
  const { data } = await client.get<StatisticResponse>('/statistic', {
    params: { from, to },
  });
  return data;
}
