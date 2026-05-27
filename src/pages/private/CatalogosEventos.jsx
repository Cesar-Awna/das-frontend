import { useState } from 'react';
import { PageHeader, Badge, Button, Modal } from '../../components/ui/index.js';

const TABS = ['Ámbitos', 'Tipos de eventos', 'Medidas preventivas', 'Asignaciones'];

const CatalogosEventos = () => {
  const [tab, setTab] = useState(0);
  const [createModal, setCreateModal] = useState(false);
  const [formAmbito, setFormAmbito] = useState({ code: '', name: '', description: '' });
  const [formTipo, setFormTipo] = useState({ code: '', name: '', ambito: '', gravity: '', notification: '' });
  const [formMedida, setFormMedida] = useState({ code: '', name: '', applies: '' });

  const handleCreateAmbito = () => {
    setFormAmbito({ code: '', name: '', description: '' });
    setCreateModal(false);
  };

  const handleCreateTipo = () => {
    setFormTipo({ code: '', name: '', ambito: '', gravity: '', notification: '' });
    setCreateModal(false);
  };

  const handleCreateMedida = () => {
    setFormMedida({ code: '', name: '', applies: '' });
    setCreateModal(false);
  };

  const actions = <Button variant="primary" icon="ti-plus" onClick={() => setCreateModal(true)}>Nuevo elemento</Button>;

  return (
    <>
      <PageHeader overline="Configuración · Eventos adversos" title="Catálogos del sistema" actions={actions} />
      <div className="p-10 max-w-7xl">
        <section className="mb-8">
          <div className="overline-accent mb-3">Estructura configurable</div>
          <h2 className="font-display text-3xl text-ink-950 leading-tight max-w-3xl">
            Administre los ámbitos, tipos de eventos y medidas preventivas.
          </h2>
        </section>

        <div className="flex gap-1 border-b border-paper-200 mb-6">
          {TABS.map((t, i) => (
            <button key={i} className={`tab-btn ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
              {t} <span className="text-stone-500 ml-1">{[4, 18, 23, 12][i]}</span>
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-5">
              <h3 className="font-display text-lg text-ink-950 mb-4">Ámbitos definidos</h3>
              <div className="card">
                {defaultAmbitos.map((a, i) => (
                  <div key={i} className={`p-4 border-b border-paper-100 last:border-0 hover:bg-paper-50 cursor-pointer ${i === 0 ? 'bg-paper-50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] font-mono text-stone-600">{a.code}</span>
                        </div>
                        <div className="text-[14px] text-ink-950 font-medium">{a.name}</div>
                        <div className="text-[12px] text-stone-600 mt-1">{a.summary}</div>
                      </div>
                      <i className="ti ti-arrow-right text-stone-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-7">
              <h3 className="font-display text-lg text-ink-950 mb-4">Ámbito Clínico · Detalle</h3>
              <div className="card card-padded mb-6">
                <div className="overline mb-3">Configuración</div>
                <div className="grid grid-cols-2 gap-6">
                  <div><div className="input-label">Código</div><div className="text-[14px] text-ink-950 font-mono">AMB-01</div></div>
                  <div><div className="input-label">Estado</div><Badge variant="ok">Activo</Badge></div>
                  <div className="col-span-2"><div className="input-label">Descripción</div><div className="text-[13px] text-stone-700">Eventos ocurridos durante la atención clínica directa al paciente.</div></div>
                </div>
              </div>

              <div className="overline mb-3">Tipos de eventos en este ámbito</div>
              <div className="card mb-6">
                {defaultTipos.map((t, i) => (
                  <div key={i} className="p-4 border-b border-paper-100 last:border-0 flex items-center justify-between">
                    <div>
                      <div className="text-[13px] text-ink-950 font-medium">{t.name}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{t.code} · {t.notification} · Gravedad: {t.gravity}</div>
                    </div>
                    <i className="ti ti-edit text-stone-600 cursor-pointer hover:text-ink-950" />
                  </div>
                ))}
              </div>

              <div className="overline mb-3">Medidas preventivas vinculadas</div>
              <div className="card card-padded">
                <div className="grid grid-cols-2 gap-3">
                  {defaultMedidas.map((m, i) => (
                    <span key={i} className="text-[12px] text-stone-700 flex items-center gap-1">
                      <i className="ti ti-shield-check text-sm" /> {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="card">
            <div className="table-header" style={{ gridTemplateColumns: '100px 1fr 140px 140px 80px' }}>
              <span>Código</span><span>Nombre</span><span>Ámbito</span><span>Gravedad</span><span /></div>
            {[...defaultTipos, ...moreTipos].map((t, i) => (
              <div key={i} className="table-row" style={{ gridTemplateColumns: '100px 1fr 140px 140px 80px' }}>
                <span className="text-[12px] text-stone-600 font-mono">{t.code}</span>
                <span className="text-[13px] text-ink-950">{t.name}</span>
                <span className="text-[12px] text-stone-700">{t.ambito || 'Clínico'}</span>
                <span className="text-[12px] text-stone-700">{t.gravity}</span>
                <i className="ti ti-edit text-stone-600 cursor-pointer" />
              </div>
            ))}
          </div>
        )}

        {tab === 2 && (
          <div className="card">
            <div className="table-header" style={{ gridTemplateColumns: '100px 1fr 200px 80px' }}>
              <span>Código</span><span>Medida preventiva</span><span>Aplica a</span><span /></div>
            {[
              { code: 'MP-007', name: 'Aplicación de escala de Morse al ingreso', applies: 'Caídas' },
              { code: 'MP-012', name: 'Mantención de barandas en posición segura', applies: 'Caídas' },
              { code: 'MP-015', name: 'Identificación visual de paciente de alto riesgo', applies: 'Todos' },
              { code: 'MP-018', name: 'Doble verificación medicación', applies: 'Errores medicación' },
              { code: 'MP-022', name: 'Higiene de manos según protocolo OMS', applies: 'IAAS' },
            ].map((m, i) => (
              <div key={i} className="table-row" style={{ gridTemplateColumns: '100px 1fr 200px 80px' }}>
                <span className="text-[12px] text-stone-600 font-mono">{m.code}</span>
                <span className="text-[13px] text-ink-950">{m.name}</span>
                <span className="text-[12px] text-stone-700">{m.applies}</span>
                <i className="ti ti-edit text-stone-600 cursor-pointer" />
              </div>
            ))}
          </div>
        )}

        {tab === 3 && (
          <div>
            <div className="overline-accent mb-2">Asignación de usuarios</div>
            <h3 className="font-display text-xl text-ink-950 mb-1">Notificación por servicio (gap 4.1)</h3>
            <p className="text-[13px] text-stone-600 mb-6">Configure qué usuarios deben ser notificados cuando ocurre un evento en cada servicio.</p>

            <div className="card">
              <div className="table-header" style={{ gridTemplateColumns: '1fr 1fr 100px' }}>
                <span>Servicio / Unidad</span><span>Usuarios a notificar</span><span /></div>
              {[
                { service: 'CEMSCO Lorenzo Arenas · Box atención', users: 'D. Cáceres, M. Soto, Dr. P. Henríquez' },
                { service: 'CEMSCO Lorenzo Arenas · Vacunatorio', users: 'A. Reyes, D. Cáceres' },
                { service: 'CESFAM Tucapel · Farmacia', users: 'L. Muñoz, D. Cáceres' },
                { service: 'Servicio Dental · Box 3', users: 'R. Vidal, D. Cáceres' },
              ].map((row, i) => (
                <div key={i} className="table-row" style={{ gridTemplateColumns: '1fr 1fr 100px' }}>
                  <span className="text-[13px] text-ink-950 font-medium">{row.service}</span>
                  <span className="text-[12px] text-stone-700">{row.users}</span>
                  <Button variant="ghost" icon="ti-edit">Editar</Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODALES DE CREACIÓN CONTEXTUALES */}

        {/* MODAL: CREAR ÁMBITO */}
        <Modal open={createModal && tab === 0} onClose={() => setCreateModal(false)} title="Crear nuevo ámbito">
          <p className="text-[13px] text-stone-600 mb-6">Un ámbito agrupa tipos de eventos con características comunes.</p>
          <div className="space-y-5">
            <div>
              <label className="input-label">Código del ámbito *</label>
              <input type="text" className="input-line font-mono" placeholder="Ej: AMB-05" value={formAmbito.code} onChange={(e) => setFormAmbito({ ...formAmbito, code: e.target.value })} />
            </div>
            <div>
              <label className="input-label">Nombre del ámbito *</label>
              <input type="text" className="input-line" placeholder="Ej: Seguridad del equipamiento" value={formAmbito.name} onChange={(e) => setFormAmbito({ ...formAmbito, name: e.target.value })} />
            </div>
            <div>
              <label className="input-label">Descripción *</label>
              <textarea className="input-line" rows="3" placeholder="Describir eventos que ocurren en este ámbito…" value={formAmbito.description} onChange={(e) => setFormAmbito({ ...formAmbito, description: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="primary" full onClick={handleCreateAmbito}>Crear ámbito</Button>
              <Button variant="secondary" onClick={() => setCreateModal(false)}>Cancelar</Button>
            </div>
          </div>
        </Modal>

        {/* MODAL: CREAR TIPO DE EVENTO */}
        <Modal open={createModal && tab === 1} onClose={() => setCreateModal(false)} title="Crear tipo de evento">
          <p className="text-[13px] text-stone-600 mb-6">Defina un nuevo tipo de evento dentro de la estructura de ámbitos.</p>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Código *</label>
                <input type="text" className="input-line font-mono" placeholder="TE-009" value={formTipo.code} onChange={(e) => setFormTipo({ ...formTipo, code: e.target.value })} />
              </div>
              <div>
                <label className="input-label">Ámbito *</label>
                <select className="input-line" value={formTipo.ambito} onChange={(e) => setFormTipo({ ...formTipo, ambito: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option>Clínico</option>
                  <option>Administrativo</option>
                  <option>Infraestructura</option>
                  <option>Equipamiento</option>
                </select>
              </div>
            </div>
            <div>
              <label className="input-label">Nombre del tipo *</label>
              <input type="text" className="input-line" placeholder="Ej: Fallo de equipamiento crítico" value={formTipo.name} onChange={(e) => setFormTipo({ ...formTipo, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Gravedad *</label>
                <select className="input-line" value={formTipo.gravity} onChange={(e) => setFormTipo({ ...formTipo, gravity: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option>Leve</option>
                  <option>Moderado</option>
                  <option>Grave</option>
                  <option>Variable</option>
                  <option>Centinela</option>
                </select>
              </div>
              <div>
                <label className="input-label">Requiere notificación *</label>
                <select className="input-line" value={formTipo.notification} onChange={(e) => setFormTipo({ ...formTipo, notification: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option>Notificación obligatoria</option>
                  <option>Notificación opcional</option>
                  <option>Solo registro interno</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="primary" full onClick={handleCreateTipo}>Crear tipo</Button>
              <Button variant="secondary" onClick={() => setCreateModal(false)}>Cancelar</Button>
            </div>
          </div>
        </Modal>

        {/* MODAL: CREAR MEDIDA PREVENTIVA */}
        <Modal open={createModal && tab === 2} onClose={() => setCreateModal(false)} title="Crear medida preventiva">
          <p className="text-[13px] text-stone-600 mb-6">Agregue una medida que puede vincularse a tipos de eventos para reducir su ocurrencia.</p>
          <div className="space-y-5">
            <div>
              <label className="input-label">Código de medida *</label>
              <input type="text" className="input-line font-mono" placeholder="MP-025" value={formMedida.code} onChange={(e) => setFormMedida({ ...formMedida, code: e.target.value })} />
            </div>
            <div>
              <label className="input-label">Descripción de la medida *</label>
              <input type="text" className="input-line" placeholder="Ej: Protocolo de comunicación clara en transporte de pacientes" value={formMedida.name} onChange={(e) => setFormMedida({ ...formMedida, name: e.target.value })} />
            </div>
            <div>
              <label className="input-label">Aplica a (tipos de eventos) *</label>
              <select className="input-line" value={formMedida.applies} onChange={(e) => setFormMedida({ ...formMedida, applies: e.target.value })}>
                <option value="">Seleccionar…</option>
                <option>Caídas</option>
                <option>Errores medicación</option>
                <option>IAAS</option>
                <option>Todos</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="primary" full onClick={handleCreateMedida}>Crear medida</Button>
              <Button variant="secondary" onClick={() => setCreateModal(false)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const defaultAmbitos = [
  { code: 'AMB-01', name: 'Clínico', summary: '8 tipos de eventos asociados · 12 medidas preventivas' },
  { code: 'AMB-02', name: 'Administrativo', summary: '4 tipos de eventos · 5 medidas' },
  { code: 'AMB-03', name: 'Infraestructura', summary: '3 tipos de eventos · 3 medidas' },
  { code: 'AMB-04', name: 'Equipamiento', summary: '3 tipos de eventos · 3 medidas' },
];

const defaultTipos = [
  { code: 'TE-001', name: 'Caída de paciente', notification: 'Notificación obligatoria', gravity: 'variable' },
  { code: 'TE-002', name: 'Error de medicación', notification: 'Notificación obligatoria', gravity: 'moderado–grave' },
  { code: 'TE-003', name: 'Reacción adversa a medicamento', notification: 'Notificación obligatoria', gravity: 'leve–centinela' },
  { code: 'TE-004', name: 'Identificación incorrecta de muestra', notification: 'Notificación obligatoria', gravity: 'grave' },
  { code: 'TE-005', name: 'Infección asociada a la atención', notification: 'Notificación obligatoria', gravity: 'grave–centinela' },
];
const moreTipos = [
  { code: 'TE-006', name: 'Demora en atención', gravity: 'leve', ambito: 'Administrativo' },
  { code: 'TE-007', name: 'Pérdida de documentación clínica', gravity: 'moderado', ambito: 'Administrativo' },
  { code: 'TE-008', name: 'Fallo de equipamiento crítico', gravity: 'grave', ambito: 'Equipamiento' },
];

const defaultMedidas = ['MP-007 · Escala de Morse al ingreso', 'MP-012 · Barandas en posición segura', 'MP-015 · Identificación visual', 'MP-018 · Doble verificación medicación'];

export default CatalogosEventos;
