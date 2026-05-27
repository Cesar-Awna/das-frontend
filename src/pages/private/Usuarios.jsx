import { useState } from 'react';
import { PageHeader, Badge, Button, Modal } from '../../components/ui/index.js';
import { useUsers, useUserStats } from '../../hooks/useDomain.js';

const Usuarios = () => {
  const users = useUsers().data?.data || defaultUsers;
  const stats = useUserStats().data?.data || defaultStats;
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', rut: '', role: '', service: '' });

  const handleCreateUser = () => {
    setForm({ name: '', email: '', rut: '', role: '', service: '' });
    setCreateModal(false);
  };

  return (
    <>
      <PageHeader overline="Administración" title="Usuarios del sistema" actions={<Button variant="primary" icon="ti-user-plus" onClick={() => setCreateModal(true)}>Nuevo usuario</Button>} />
      <div className="p-10 max-w-7xl">
        <section className="grid grid-cols-4 gap-px bg-paper-100 border border-paper-100 mb-10">
          <div className="bg-white p-6"><div className="overline mb-2">Total usuarios</div><div className="font-display text-3xl text-ink-950">{stats.total}</div></div>
          <div className="bg-white p-6"><div className="overline mb-2">Administradores</div><div className="font-display text-3xl text-ink-950">{stats.admins}</div></div>
          <div className="bg-white p-6"><div className="overline mb-2">Usuarios activos</div><div className="font-display text-3xl text-status-ok">{stats.active}</div></div>
          <div className="bg-white p-6"><div className="overline mb-2">Conectados hoy</div><div className="font-display text-3xl text-ink-950">{stats.todayOnline}</div></div>
        </section>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input className="input-box pl-10" placeholder="Buscar por nombre, RUT, email…" />
          </div>
          <select className="input-box max-w-xs"><option>Todos los perfiles</option><option>Administradores</option><option>Usuarios</option></select>
          <select className="input-box max-w-xs"><option>Todos los servicios</option></select>
        </div>

        <div className="card">
          <div className="table-header" style={{ gridTemplateColumns: '50px 1fr 180px 160px 120px 80px' }}>
            <span /><span>Usuario</span><span>Cargo</span><span>Servicio</span><span>Perfil</span><span /></div>
          {users.map((u) => (
            <div key={u.rut} className="table-row" style={{ gridTemplateColumns: '50px 1fr 180px 160px 120px 80px' }}>
              <div className={`w-9 h-9 flex items-center justify-center font-display text-sm ${u.isAdmin ? 'bg-accent/20 border border-accent/30 text-accent-dark' : 'bg-stone-100 border border-paper-200 text-stone-700'}`}>
                {u.initials}
              </div>
              <div>
                <div className="text-[14px] text-ink-950 font-medium">{u.name}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{u.email} · {u.rut}</div>
              </div>
              <span className="text-[13px] text-stone-700">{u.role}</span>
              <span className="text-[13px] text-stone-700">{u.service}</span>
              <Badge variant={u.isAdmin ? 'ink' : 'default'}>{u.isAdmin ? 'Admin' : 'Usuario'}</Badge>
              <i className="ti ti-dots text-stone-600 cursor-pointer" />
            </div>
          ))}
        </div>

        {/* MODAL DE CREACIÓN DE USUARIO */}
        <Modal open={createModal} onClose={() => setCreateModal(false)} title="Crear nuevo usuario">
          <p className="text-[13px] text-stone-600 mb-6">Complete los datos del nuevo usuario. Se enviará invitación por email.</p>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Nombre completo *</label>
                <input type="text" className="input-line" placeholder="Ej: María Soto Vargas" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="input-label">RUT *</label>
                <input type="text" className="input-line font-mono" placeholder="Ej: 16.789.432-1" value={form.rut} onChange={(e) => setForm({ ...form, rut: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="input-label">Email institucional *</label>
              <input type="email" className="input-line" placeholder="usuario@dasconcepcion.cl" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Cargo *</label>
                <select className="input-line" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option>Gestor de calidad</option>
                  <option>Enfermera coordinadora</option>
                  <option>Cirujano dentista</option>
                  <option>Químico farmacéutico</option>
                  <option>Tens encargado</option>
                  <option>Administrativo</option>
                </select>
              </div>
              <div>
                <label className="input-label">Servicio/Unidad *</label>
                <select className="input-line" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                  <option value="">Seleccionar…</option>
                  <option>Dirección DAS</option>
                  <option>CEMSCO Lorenzo Arenas</option>
                  <option>CEMSCO Tucapel</option>
                  <option>CESFAM Lorenzo Arenas</option>
                  <option>CESFAM Tucapel</option>
                  <option>Servicio Dental</option>
                </select>
              </div>
            </div>
            <div className="bg-paper-50 border border-paper-200 p-4 rounded-none">
              <label className="flex items-center gap-2 text-[13px] text-stone-700">
                <input type="checkbox" className="accent-ink-950" defaultChecked />
                Enviar invitación por email para completar contraseña
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="primary" full onClick={handleCreateUser}>Crear usuario</Button>
              <Button variant="secondary" onClick={() => setCreateModal(false)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

const defaultStats = { total: 47, admins: 3, active: 44, todayOnline: 23 };
const defaultUsers = [
  { initials: 'DC', name: 'Daniel Cáceres Cerda', email: 'd.caceres@dasconcepcion.cl', rut: '15.432.876-9', role: 'Gestor de calidad', service: 'Dirección DAS', isAdmin: true },
  { initials: 'MS', name: 'María Soto Vargas', email: 'm.soto@dasconcepcion.cl', rut: '16.789.432-1', role: 'Enfermera coord.', service: 'CEMSCO Lorenzo Arenas' },
  { initials: 'RV', name: 'Roberto Vidal Carrasco', email: 'r.vidal@dasconcepcion.cl', rut: '14.321.987-2', role: 'Cirujano dentista', service: 'Servicio Dental' },
  { initials: 'LM', name: 'Lucía Muñoz Bravo', email: 'l.munoz@dasconcepcion.cl', rut: '17.456.789-K', role: 'Químico farmacéutico', service: 'CESFAM Tucapel' },
  { initials: 'CP', name: 'Carolina Pérez Núñez', email: 'c.perez@dasconcepcion.cl', rut: '18.234.567-3', role: 'Tens encargado', service: 'CEMSCO Lorenzo Arenas' },
  { initials: 'AR', name: 'Antonio Reyes Hidalgo', email: 'a.reyes@dasconcepcion.cl', rut: '13.654.321-8', role: 'Matrón', service: 'CESFAM Lorenzo Arenas' },
];

export default Usuarios;
