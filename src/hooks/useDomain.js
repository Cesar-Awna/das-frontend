import { useQuery } from '@tanstack/react-query';
import Acreditacion from '../services/Acreditacion.js';
import Ntb from '../services/Ntb.js';
import Supervision from '../services/Supervision.js';
import ImprovementPlans from '../services/ImprovementPlans.js';
import Users from '../services/Users.js';
import Organizations from '../services/Organizations.js';
import Workspace from '../services/Workspace.js';
import Search from '../services/Search.js';
import Reports from '../services/Reports.js';
import Audit from '../services/Audit.js';
import Notifications from '../services/Notifications.js';

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

const withDevModeDisabled = (enabled) => !isDevMode() && enabled;

const baseOptions = { refetchOnWindowFocus: false, retry: 1 };

// Acreditación
export const useAutoevaluacion = (id) =>
  useQuery({
    queryKey: ['autoevaluacion', id],
    queryFn: () => Acreditacion.getAutoevaluacion(id),
    enabled: !isDevMode() && !!id,
    ...baseOptions,
  });

export const useAutoevaluaciones = (params) =>
  useQuery({
    queryKey: ['autoevaluaciones', params],
    queryFn: () => Acreditacion.autoevaluaciones(params),
    enabled: !isDevMode(),
    ...baseOptions,
  });

// NTB
export const useNtbEvaluaciones = (params) =>
  useQuery({
    queryKey: ['ntb', 'evaluaciones', params],
    queryFn: () => Ntb.evaluaciones(params),
    enabled: !isDevMode(),
    ...baseOptions,
  });

export const useNtbEvaluacion = (id) =>
  useQuery({
    queryKey: ['ntb', id],
    queryFn: () => Ntb.getEvaluacion(id),
    enabled: !isDevMode() && !!id,
    ...baseOptions,
  });

export const useNtbInformeValorizado = (id) =>
  useQuery({
    queryKey: ['ntb', id, 'informe-valorizado'],
    queryFn: () => Ntb.informeValorizado(id),
    enabled: !isDevMode() && !!id,
    ...baseOptions,
  });

// Supervisión
export const useSupervisionPautas = (params) =>
  useQuery({
    queryKey: ['supervision', 'pautas', params],
    queryFn: () => Supervision.pautas(params),
    enabled: !isDevMode(),
    ...baseOptions,
  });

export const useSupervisionPauta = (id) =>
  useQuery({
    queryKey: ['supervision', 'pauta', id],
    queryFn: () => Supervision.getPauta(id),
    enabled: !isDevMode() && !!id,
    ...baseOptions,
  });

// Improvement plans
export const useImprovementPlan = (id) =>
  useQuery({
    queryKey: ['plan', id],
    queryFn: () => ImprovementPlans.getById(id),
    enabled: !isDevMode() && !!id,
    ...baseOptions,
  });

export const useImprovementPlans = (params) =>
  useQuery({
    queryKey: ['plans', params],
    queryFn: () => ImprovementPlans.list(params),
    enabled: !isDevMode(),
    ...baseOptions,
  });

// Users
export const useUsers = (params) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => Users.list(params),
    enabled: !isDevMode(),
    ...baseOptions,
  });

export const useUserStats = () =>
  useQuery({
    queryKey: ['users', 'stats'],
    queryFn: () => Users.stats(),
    enabled: !isDevMode(),
    ...baseOptions,
  });

// Organizations
export const useOrgTree = () =>
  useQuery({
    queryKey: ['org', 'tree'],
    queryFn: () => Organizations.tree(),
    enabled: !isDevMode(),
    ...baseOptions,
  });

export const useOrganization = (id) =>
  useQuery({
    queryKey: ['org', id],
    queryFn: () => Organizations.getById(id),
    enabled: !isDevMode() && !!id,
    ...baseOptions,
  });

// Workspace
export const useMyTasks = () =>
  useQuery({
    queryKey: ['workspace', 'my-tasks'],
    queryFn: () => Workspace.myTasks(),
    enabled: !isDevMode(),
    ...baseOptions,
  });

// Search
export const useSearch = (q, filters) =>
  useQuery({
    queryKey: ['search', q, filters],
    queryFn: () => Search.global(q, filters),
    enabled: !isDevMode() && !!q && q.length >= 2,
    ...baseOptions,
  });

// Reports
export const useReports = () =>
  useQuery({
    queryKey: ['reports', 'list'],
    queryFn: () => Reports.list(),
    enabled: !isDevMode(),
    ...baseOptions,
  });

export const useRecentReports = () =>
  useQuery({
    queryKey: ['reports', 'recent'],
    queryFn: () => Reports.recent(),
    enabled: !isDevMode(),
    ...baseOptions,
  });

// Audit
export const useAuditLogs = (params) =>
  useQuery({
    queryKey: ['audit', 'logs', params],
    queryFn: () => Audit.logs(params),
    enabled: !isDevMode(),
    ...baseOptions,
  });

// Notifications
export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: () => Notifications.list(),
    enabled: !isDevMode(),
    ...baseOptions,
  });

export const useUnreadNotifications = () =>
  useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => Notifications.unreadCount(),
    enabled: !isDevMode(),
    ...baseOptions,
  });
