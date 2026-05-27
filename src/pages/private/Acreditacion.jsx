import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PageHeader, Badge, Loader, ErrorState, ProgressBar, Button, Modal } from '../../components/ui/index.js';
import { useIndicators, useIndicatorStats } from '../../hooks/useIndicators.js';

const Acreditacion = () => {
  const list = useIndicators();
  const stats = useIndicatorStats();
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', ambito: '', frequency: '', goal: '', responsible: '', deputy: '' });

  const indicators = list.data?.data || defaultIndicators;
  const statsData = stats.data?.data || defaultStats;

  const handleCreateIndicator = () => {
    setForm({ code: '', name: '', ambito: '', frequency: '', goal: '', responsible: '', deputy: '' });
    setCreateModal(false);
  };

  const actions = (
    <>
      <Link to="/comparativa" className="btn btn-secondary">
        <i className="ti ti-chart-arrows" /> Comparativa
      </Link>
      <Link to="/autoevaluacion" className="btn btn-secondary">
        <i className="ti ti-list-check" /> Autoevaluación
      </Link>
      <button className="btn btn-secondary"><i className="ti ti-download" /> Exportar reporte</button>
      <Button variant="primary" icon="ti-plus" onClick={() => setCreateModal(true)}>Nuevo indicador</Button>
    </>
  );

  if (list.isLoading) return <Loader message="Cargando indicadores…" />;
  if (list.isError && !list.data) return <ErrorState error={list.error} onRetry={list.refetch} />;

  return (
    <>
      <PageHeader overline="Módulo 1 · Acreditación de prestadores" title="Indicadores y monitoreo" actions={actions} />
      <div className="p-10 max-w-7xl">
        <section className="mb-10 grid grid-cols-12 gap-10 items-end">
          <div className="col-span-7">
            <div className="overline-accent mb-3">Manual de acreditación · Superintendencia de Salud</div>
            <h2 className="font-display text-3xl text-ink-950 leading-tight">
              Cumplimiento global <em className="italic-accent">{statsData.globalCompliance}%</em> en el periodo Q2 2026.
            </h2>
          </div>
          <div className="col-span-5 grid grid-cols-3 gap-4 text-[13px]">
            <div>
              <div className="overline">Total</div>
              <div className="font-display text-2xl text-ink-950 mt-1">{statsData.total}</div>
              <div className="text-[11px] text-stone-600">indicadores</div>
            </div>
            <div>
              <div className="overline">Obligatorios</div>
              <div className="font-display text-2xl text-ink-950 mt-1">{statsData.mandatory}</div>
              <div className="text-[11px] text-status-ok">{statsData.compliant} cumplen</div>
            </div>
            <div>
              <div className="overline">Atrasados</div>
              <div className="font-display text-2xl text-status-danger mt-1">{statsData.overdue}</div>
              <div className="text-[11px] text-stone-600">requieren carga</div>
            </div>
          </div>
        </section>

        <section className="card card-padded mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-xl text-ink-950">Evolución del cumplimiento global</h3>
              <p className="text-[13px] text-stone-600 mt-1">Últimos 6 meses · Promedio ponderado de indicadores obligatorios</p>
            </div>
          </div>
          <svg viewBox="0 0 800 280" className="w-full">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f2240" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#0f2240" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[40, 100, 160, 220].map((y, i) => <line key={i} x1="60" y1={y} x2="780" y2={y} stroke="#eaeae0" strokeWidth="0.5" />)}
            {['100%', '90%', '80%', '70%'].map((t, i) => <text key={i} x="50" y={44 + i * 60} textAnchor="end" fill="#6b6b62" fontSize="11">{t}</text>)}
            {['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'].map((m, i) => <text key={i} x={120 + i * 120} y="260" textAnchor="middle" fill="#6b6b62" fontSize="11">{m}</text>)}
            <line x1="60" y1="76" x2="780" y2="76" stroke="#b8854a" strokeWidth="1" strokeDasharray="4 4" />
            <text x="775" y="72" textAnchor="end" fill="#b8854a" fontSize="10">Meta 95%</text>
            <path d="M120,184 L240,172 L360,160 L480,148 L600,136 L720,124 L720,240 L120,240 Z" fill="url(#g1)" />
            <polyline points="120,184 240,172 360,160 480,148 600,136 720,124" fill="none" stroke="#0f2240" strokeWidth="2" />
            {[[120, 184], [240, 172], [360, 160], [480, 148], [600, 136]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#0f2240" strokeWidth="2" />
            ))}
            <circle cx="720" cy="124" r="5" fill="#0f2240" />
            <text x="720" y="110" textAnchor="middle" fill="#0f2240" fontSize="13" fontWeight="600" fontFamily="Fraunces">87,4%</text>
          </svg>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl text-ink-950">Indicadores del periodo</h3>
            <div className="flex gap-2">
              <select className="input-box max-w-xs"><option>Todos los ámbitos</option></select>
              <select className="input-box max-w-xs"><option>Todos los estados</option></select>
            </div>
          </div>
          <div className="card">
            <div className="table-header" style={{ gridTemplateColumns: '100px 1fr 180px 100px 140px 80px' }}>
              <span>Código</span><span>Indicador</span><span>Responsable</span><span>Meta</span><span>Cumplimiento</span><span />
            </div>
            {indicators.map((ind) => (
              <Link key={ind.code} to={`/indicadores/${ind.code}`} className="table-row block" style={{ display: 'grid', gridTemplateColumns: '100px 1fr 180px 100px 140px 80px' }}>
                <span className="text-[12px] text-stone-600 font-mono">{ind.code}</span>
                <div>
                  <div className="text-[14px] text-ink-950 font-medium">{ind.name}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{ind.ambito} · {ind.frequency}</div>
                </div>
                <span className="text-[13px] text-stone-700">{ind.responsible}</span>
                <span className="text-[13px] text-stone-700">{ind.goal}</span>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className={`font-display text-[18px] text-status-${ind.variant}`}>{ind.value}</span>
                    <Badge variant={ind.variant}>{ind.status}</Badge>
                  </div>
                  <ProgressBar value={ind.percent} variant={ind.variant} thin />
                </div>
                <i className="ti ti-arrow-up-right text-stone-600" />
              </Link>
            ))}
          </div>
        </section>

        {/* MODAL DE CREACIÓN DE INDICADOR */}
        <Modal open={createModal} onClose={() => setCreateModal(false)} title="Crear nuevo indicador">
          <p className="text-[13px] text-stone-600 mb-6">Configure un nuevo indicador de acreditación vinculado al Manual de la Superintendencia.</p>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Código *</label>
                <input type="text" className="input-line font-mono" placeholder="Ej: CAL-05" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>
              <div>
                <label className="input-label">Ámbito *</label>
                <select className="input-line" value={form.ambito} onChange={(e) => setForm({ ...form, ambito: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option>Seguridad del paciente</option>
                  <option>Dignidad del paciente</option>
                  <option>Gestión de la calidad</option>
                  <option>Acceso y oportunidad</option>
                  <option>Registros clínicos</option>
                </select>
              </div>
            </div>
            <div>
              <label className="input-label">Nombre del indicador *</label>
              <input type="text" className="input-line" placeholder="Ej: Cumplimiento de consentimiento informado" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Periodicidad *</label>
                <select className="input-line" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option>Mensual</option>
                  <option>Trimestral</option>
                  <option>Semestral</option>
                  <option>Anual</option>
                </select>
              </div>
              <div>
                <label className="input-label">Meta (goal) *</label>
                <input type="text" className="input-line" placeholder="Ej: ≥ 95%" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Responsable titular *</label>
                <select className="input-line" value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option>D. Cáceres</option>
                  <option>M. Soto</option>
                  <option>R. Vidal</option>
                  <option>L. Muñoz</option>
                </select>
              </div>
              <div>
                <label className="input-label">Responsable suplente</label>
                <select className="input-line" value={form.deputy} onChange={(e) => setForm({ ...form, deputy: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option>D. Cáceres</option>
                  <option>M. Soto</option>
                  <option>R. Vidal</option>
                  <option>L. Muñoz</option>
                  <option>A. Reyes</option>
                </select>
              </div>
            </div>
            <div className="bg-paper-50 border border-paper-200 p-4">
              <div className="text-[12px] text-stone-600">
                <p>Se habilitará carga de mediciones a partir del siguiente periodo.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="primary" full onClick={handleCreateIndicator}>Crear indicador</Button>
              <Button variant="secondary" onClick={() => setCreateModal(false)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const defaultStats = { globalCompliance: '87,4', total: 48, mandatory: 32, compliant: 28, overdue: 3 };
const defaultIndicators = [
  { code: 'IAAS-03', name: 'Tasa de infecciones asociadas a atención', ambito: 'Seguridad del paciente', frequency: 'Mensual', responsible: 'D. Cáceres', goal: '≤ 3,0%', value: '5,2%', percent: 42, variant: 'danger', status: 'No cumple' },
  { code: 'DIG-01', name: 'Cumplimiento de consentimiento informado', ambito: 'Dignidad del paciente', frequency: 'Mensual', responsible: 'M. Soto', goal: '≥ 95%', value: '97,8%', percent: 98, variant: 'ok', status: 'Cumple' },
  { code: 'CAL-04', name: 'Aplicación de pautas planificadas', ambito: 'Gestión de calidad', frequency: 'Trimestral', responsible: 'D. Cáceres', goal: '≥ 90%', value: '92,5%', percent: 92, variant: 'ok', status: 'Cumple' },
  { code: 'REG-02', name: 'Calidad de registros clínicos completos', ambito: 'Registros clínicos', frequency: 'Mensual', responsible: 'R. Vidal', goal: '≥ 85%', value: '71,3%', percent: 71, variant: 'warn', status: 'Bajo meta' },
  { code: 'EQP-01', name: 'Mantención preventiva de equipos críticos', ambito: 'Seguridad equipamiento', frequency: 'Trimestral', responsible: 'L. Muñoz', goal: '≥ 90%', value: '58,0%', percent: 58, variant: 'danger', status: 'No cumple' },
];

export default Acreditacion;
