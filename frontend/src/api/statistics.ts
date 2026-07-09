import { api } from './client';
import type { StatisticResponse } from '../types';

// Backend requires both `from` and `to` as LocalDateTime strings with no timezone offset.
export function getStatistic(from: string, to: string) {
  return api.get<StatisticResponse>('/statistic', { params: { from, to } }).then((r) => r.data);
}
