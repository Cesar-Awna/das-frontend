import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Documents from '../services/Documents.js';

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

export const useDocuments = (params) =>
  useQuery({
    queryKey: ['documents', 'list', params],
    queryFn: () => Documents.list(params),
    enabled: !isDevMode(),
    refetchOnWindowFocus: false,
    retry: 1,
  });

export const useDocument = (id) =>
  useQuery({
    queryKey: ['documents', id],
    queryFn: () => Documents.getById(id),
    enabled: !isDevMode() && !!id,
    refetchOnWindowFocus: false,
    retry: 1,
  });

export const useDocumentVersions = (id) =>
  useQuery({
    queryKey: ['documents', id, 'versions'],
    queryFn: () => Documents.versions(id),
    enabled: !isDevMode() && !!id,
    refetchOnWindowFocus: false,
    retry: 1,
  });

export const useDocumentsByPeriod = (period) =>
  useQuery({
    queryKey: ['documents', 'period', period],
    queryFn: () => Documents.byPeriod(period),
    enabled: !isDevMode() && !!period,
    refetchOnWindowFocus: false,
    retry: 1,
  });

export const useApproveDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => Documents.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }),
  });
};
