import { useState } from 'react';
import { PageHeader, Badge, Button, Modal } from '../../components/ui/index.js';
import { useDocuments } from '../../hooks/useDocuments.js';

const TABS = [
  { label: 'Vigentes', count: 142, variant: 'default' },
  { label: 'Por vencer', count: 8, variant: 'warn' },
  { label: 'Vencidos', count: 2, variant: 'danger' },
  { label: 'Archivados', count: null },
  { label: 'Por aprobar', count: 3 },
];

const Documental = () => {
  const [tab, setTab] = useState(0);
  const [versionModal, setVersionModal] = useState(null);
  const [previewModal, setPreviewModal] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', type: '', category: '', responsible: '', expiry: '' });
  const docs = useDocuments();
  const documents = docs.data?.data || defaultDocs;

  const handleCreateDoc = () => {
    setForm({ code: '', name: '', type: '', category: '', responsible: '', expiry: '' });
    setCreateModal(false);
  };

  const actions = (
    <>
      <Button variant="secondary" icon="ti-alert-triangle">Notificar evento</Button>
      <Button variant="primary" icon="ti-plus" onClick={() => setCreateModal(true)}>Nuevo documento</Button>
    </>
  );

  return (
    <>
      <PageHeader overline="Módulo 3 · Gestión de calidad" title="Sistema documental" actions={actions} />
      <div className="p-10 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 border-b border-paper-200">
            {TABS.map((t, i) => (
              <button key={i} className={`tab-btn ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
                {t.label}
                {t.count !== null && <span className={`ml-1 ${t.variant === 'warn' ? 'text-status-warn' : t.variant === 'danger' ? 'text-status-danger' : 'text-stone-500'}`}>{t.count}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input className="input-box pl-10" placeholder="Buscar por nombre, código, contenido…" />
          </div>
          <select className="input-box max-w-xs"><option>Todos los tipos</option></select>
          <select className="input-box max-w-xs"><option>Todas las categorías</option></select>
        </div>

        <div className="card">
          <div className="table-header" style={{ gridTemplateColumns: '80px 1fr 140px 120px 120px 110px' }}>
            <span>Código</span><span>Documento</span><span>Responsable</span><span>Versión</span><span>Vencimiento</span><span>Acciones</span>
          </div>
          {documents.map((d) => (
            <div key={d.code} className="table-row" style={{ gridTemplateColumns: '80px 1fr 140px 120px 120px 110px' }}>
              <span className="text-[12px] text-stone-600 font-mono">{d.code}</span>
              <div>
                <div className="text-[14px] text-ink-950 font-medium">{d.name}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{d.type} · {d.service}</div>
              </div>
              <span className="text-[13px] text-stone-700">{d.responsible}</span>
              <button onClick={() => setVersionModal(d)} className="text-left bg-transparent border-none cursor-pointer">
                <div className="text-[13px] text-ink-950 underline decoration-paper-200">{d.version}</div>
                <div className="text-[11px] text-stone-500">{d.versionDate}</div>
              </button>
              <div>
                <div className={`text-[13px] ${d.expiringVariant ? `text-status-${d.expiringVariant}` : 'text-ink-950'}`}>{d.expiry}</div>
                <div className={`text-[11px] ${d.expiringVariant ? `text-status-${d.expiringVariant}` : 'text-stone-500'}`}>{d.expiryLabel}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setPreviewModal(d)} className="text-stone-600 hover:text-ink-950 p-1" title="Vista previa">
                  <i className="ti ti-eye" />
                </button>
                <button className="text-stone-600 hover:text-ink-950 p-1" title="Descargar PDF">
                  <i className="ti ti-download" />
                </button>
                <button className="text-stone-600 hover:text-ink-950 p-1" title="Detalle">
                  <i className="ti ti-arrow-up-right" />
                </button>
              </div>
            </div>
          ))}

          <div className="px-6 py-4 flex items-center justify-between border-t border-paper-100">
            <span className="text-[12px] text-stone-600">Mostrando {documents.length} de 142 documentos</span>
            <div className="flex gap-1">
              <button className="w-8 h-8 border border-paper-200 text-stone-600 hover:border-ink-800 bg-white"><i className="ti ti-chevron-left" /></button>
              <button className="w-8 h-8 bg-ink-950 text-paper">1</button>
              <button className="w-8 h-8 border border-paper-200 text-stone-600 bg-white">2</button>
              <button className="w-8 h-8 border border-paper-200 text-stone-600 bg-white">3</button>
              <button className="w-8 h-8 border border-paper-200 text-stone-600 hover:border-ink-800 bg-white"><i className="ti ti-chevron-right" /></button>
            </div>
          </div>
        </div>

        {/* SELECTOR DE VERSIÓN POR PERIODO (gap 3.1) */}
        <Modal open={!!versionModal} onClose={() => setVersionModal(null)} title={versionModal ? `Versiones · ${versionModal.code}` : ''}>
          {versionModal && (
            <>
              <p className="text-[13px] text-stone-600 mb-4">
                Selecciona la versión a visualizar según el periodo evaluado.
              </p>
              <div className="space-y-2">
                {[
                  { v: 'v2.3', date: '12 mar 2026', period: 'Q2 2026', current: true, user: 'M. Soto' },
                  { v: 'v2.2', date: '05 ene 2026', period: 'Q1 2026', current: false, user: 'D. Cáceres' },
                  { v: 'v2.1', date: '10 oct 2025', period: 'Q4 2025', current: false, user: 'D. Cáceres' },
                  { v: 'v2.0', date: '15 jul 2025', period: 'Q3 2025', current: false, user: 'M. Soto' },
                  { v: 'v1.9', date: '20 abr 2025', period: 'Q2 2025', current: false, user: 'D. Cáceres' },
                ].map((ver, i) => (
                  <div key={i} className={`p-4 border ${ver.current ? 'border-accent bg-accent/5' : 'border-paper-100'} flex items-center justify-between`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[13px] text-ink-950">{ver.v}</span>
                        {ver.current && <Badge variant="ok">Vigente</Badge>}
                      </div>
                      <div className="text-[12px] text-stone-600">Aplica a periodo: {ver.period} · {ver.user} · {ver.date}</div>
                    </div>
                    <Button variant="secondary" icon="ti-eye">Ver</Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </Modal>

        {/* VISTA PREVIA DEL PDF (gap 1.2) */}
        <Modal open={!!previewModal} onClose={() => setPreviewModal(null)} title={previewModal ? `Vista previa · ${previewModal.name}` : ''} maxWidth="900px">
          {previewModal && (
            <div className="bg-paper-50 border border-paper-100 p-8 min-h-[500px] font-mono text-[12px] text-stone-700 leading-relaxed">
              <div className="text-center mb-8">
                <div className="font-display text-2xl text-ink-950">{previewModal.code} · {previewModal.name}</div>
                <div className="overline mt-2">Versión {previewModal.version} · {previewModal.responsible}</div>
              </div>
              <p className="mb-3"><strong>1. OBJETIVO</strong></p>
              <p className="mb-3">Establecer los lineamientos y procedimientos para la {previewModal.name.toLowerCase()} en el establecimiento, garantizando la seguridad del paciente y la calidad de la atención.</p>
              <p className="mb-3"><strong>2. ALCANCE</strong></p>
              <p className="mb-3">Aplica a todos los profesionales del {previewModal.service} que participen en el proceso.</p>
              <p className="mb-3"><strong>3. RESPONSABILIDADES</strong></p>
              <p className="mb-3">El responsable de la aplicación de este documento es {previewModal.responsible}.</p>
              <div className="text-center mt-6 text-stone-500">— Vista previa del documento —</div>
            </div>
          )}
        </Modal>

        {/* MODAL DE CREACIÓN DE DOCUMENTO */}
        <Modal open={createModal} onClose={() => setCreateModal(false)} title="Crear nuevo documento">
          <p className="text-[13px] text-stone-600 mb-6">Ingrese los datos del nuevo documento. El versionado comienza en v1.0.</p>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Código del documento *</label>
                <input type="text" className="input-line font-mono" placeholder="POL-024" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>
              <div>
                <label className="input-label">Tipo *</label>
                <select className="input-line" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option>Protocolo</option>
                  <option>Procedimiento</option>
                  <option>Manual</option>
                  <option>Formato</option>
                  <option>Instructivo</option>
                </select>
              </div>
            </div>
            <div>
              <label className="input-label">Nombre del documento *</label>
              <input type="text" className="input-line" placeholder="Ej: Identificación segura de pacientes" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Categoría *</label>
                <select className="input-line" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option>Enfermería</option>
                  <option>Dental</option>
                  <option>Farmacia</option>
                  <option>Administrativo</option>
                  <option>Todos</option>
                </select>
              </div>
              <div>
                <label className="input-label">Responsable *</label>
                <select className="input-line" value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option>D. Cáceres</option>
                  <option>M. Soto</option>
                  <option>R. Vidal</option>
                  <option>L. Muñoz</option>
                  <option>C. Pérez</option>
                </select>
              </div>
            </div>
            <div>
              <label className="input-label">Fecha de vencimiento *</label>
              <input type="date" className="input-line" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
            </div>
            <div className="bg-paper-50 border border-paper-200 p-4">
              <div className="text-[12px] text-stone-600">
                <div className="mb-2"><strong>Nueva versión: v1.0</strong></div>
                <p>Se puede agregar contenido después de la creación.</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="primary" full onClick={handleCreateDoc}>Crear documento</Button>
              <Button variant="secondary" onClick={() => setCreateModal(false)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const defaultDocs = [
  { code: 'POL-018', name: 'Manejo de heridas crónicas', type: 'Protocolo', service: 'Enfermería', responsible: 'M. Soto', version: 'v2.3', versionDate: '12 mar 2026', expiry: '15 jun 2026', expiryLabel: 'En 20 días', expiringVariant: 'warn' },
  { code: 'PRO-042', name: 'Esterilización de instrumental dental', type: 'Procedimiento', service: 'Dental', responsible: 'R. Vidal', version: 'v1.7', versionDate: '28 ene 2026', expiry: '28 ene 2027', expiryLabel: 'Vigente' },
  { code: 'MAN-007', name: 'Manual de bioseguridad institucional', type: 'Manual', service: 'Todos', responsible: 'D. Cáceres', version: 'v3.0', versionDate: '15 feb 2026', expiry: '15 feb 2028', expiryLabel: 'Vigente' },
  { code: 'POL-023', name: 'Identificación segura de pacientes', type: 'Protocolo', service: 'Todos', responsible: 'C. Pérez', version: 'v1.4', versionDate: '05 abr 2026', expiry: '05 abr 2027', expiryLabel: 'Vigente' },
  { code: 'PRO-019', name: 'Administración segura de medicamentos', type: 'Procedimiento', service: 'Farmacia', responsible: 'L. Muñoz', version: 'v2.1', versionDate: '20 dic 2025', expiry: '20 jun 2026', expiryLabel: 'En 25 días', expiringVariant: 'warn' },
  { code: 'FOR-011', name: 'Consentimiento informado quirúrgico', type: 'Formato', service: 'Quirúrgico', responsible: 'A. Reyes', version: 'v1.2', versionDate: '18 mar 2026', expiry: '18 mar 2028', expiryLabel: 'Vigente' },
];

export default Documental;
