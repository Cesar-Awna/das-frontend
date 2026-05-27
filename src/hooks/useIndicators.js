import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Indicators from '../services/Indicators.js';

const isDevMode = () => {
  const user = localStorage.getItem('user');
  if (!user) return false;
  try {
    const parsed = JSON.parse(user);
    return parsed.token?.startsWith('dev-token-');
  } catch {
    return false;
  }
};

export const useIndicators = (params) =>
  useQuery({
    queryKey: ['indicators', 'list', params],
    queryFn: () => Indicators.list(params),
    enabled: !isDevMode(),
    refetchOnWindowFocus: false,
    retry: 1,
  });

export const useIndicator = (id) =>
  useQuery({
    queryKey: ['indicators', id],
    queryFn: () => Indicators.getById(id),
    enabled: !isDevMode() && !!id,
    refetchOnWindowFocus: false,
    retry: 1,
  });

export const useIndicatorMeasurements = (id) =>
  useQuery({
    queryKey: ['indicators', id, 'measurements'],
    queryFn: () => Indicators.measurements(id),
    enabled: !isDevMode() && !!id,
    refetchOnWindowFocus: false,
    retry: 1,
  });

export const useIndicatorStats = () =>
  useQuery({
    queryKey: ['indicators', 'stats'],
    queryFn: () => Indicators.stats(),
    enabled: !isDevMode(),
    refetchOnWindowFocus: false,
    retry: 1,
  });

export const useIndicatorComparison = (periodA, periodB) =>
  useQuery({
    queryKey: ['indicators', 'compare', periodA, periodB],
    queryFn: () => Indicators.compare(periodA, periodB),
    enabled: !isDevMode() && !!periodA && !!periodB,
    refetchOnWindowFocus: false,
    retry: 1,
  });

export const useAddMeasurement = (indicatorId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => Indicators.addMeasurement(indicatorId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['indicators', indicatorId] });
      qc.invalidateQueries({ queryKey: ['indicators', 'list'] });
    },
  });
};
