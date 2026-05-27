import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Dashboard from '../services/Dashboard.js';

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

export const useDashboardSummary = () =>
  useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => Dashboard.summary(),
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !isDevMode(),
  });

export const useDashboardActivity = () =>
  useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => Dashboard.activity(),
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: !isDevMode(),
  });

export { useQueryClient, useMutation };
