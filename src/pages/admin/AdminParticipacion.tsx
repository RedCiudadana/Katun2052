import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Save, RotateCcw, MapPin, Users, ClipboardList, MessageSquare,
  AlertCircle, CheckCircle, Map, Table2,
} from 'lucide-react';
import GuatemalaMap from '../../components/GuatemalaMap';

type DeptRow = {
  id: string;
  department_code: string;
  department_name: string;
  total_participants: number;
  survey_responses: number;
  comments_count: number;
  updated_at: string;
};

type EditState = Record<string, { total_participants: string; survey_responses: string; comments_count: string }>;

const DEPT_NAMES: { code: string; name: string }[] = [
  { code: 'GT-PE', name: 'Petén' },
  { code: 'GT-HU', name: 'Huehuetenango' },
  { code: 'GT-QC', name: 'Quiché' },
  { code: 'GT-IZ', name: 'Izabal' },
  { code: 'GT-AV', name: 'Alta Verapaz' },
  { code: 'GT-BV', name: 'Baja Verapaz' },
  { code: 'GT-ZA', name: 'Zacapa' },
  { code: 'GT-CH', name: 'Chiquimula' },
  { code: 'GT-TO', name: 'Totonicapán' },
  { code: 'GT-SO', name: 'Sololá' },
  { code: 'GT-QZ', name: 'Quetzaltenango' },
  { code: 'GT-SM', name: 'San Marcos' },
  { code: 'GT-RE', name: 'Retalhuleu' },
  { code: 'GT-SU', name: 'Suchitepéquez' },
  { code: 'GT-CM', name: 'Chimaltenango' },
  { code: 'GT-SA', name: 'Sacatepéquez' },
  { code: 'GT-GU', name: 'Guatemala' },
  { code: 'GT-PR', name: 'El Progreso' },
  { code: 'GT-JA', name: 'Jalapa' },
  { code: 'GT-ES', name: 'Escuintla' },
  { code: 'GT-SR', name: 'Santa Rosa' },
  { code: 'GT-JU', name: 'Jutiapa' },
];

type ViewMode = 'table' | 'map';

function AdminParticipacion() {
  const [rows, setRows] = useState<DeptRow[]>([]);
  const [edits, setEdits] = useState<EditState>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ code: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [view, setView] = useState<ViewMode>('table');
  const [mapKey, setMapKey] = useState(0);

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from('department_participation')
      .select('*')
      .order('department_name');
    if (data) {
      setRows(data as DeptRow[]);
      const initial: EditState = {};
      (data as DeptRow[]).forEach(r => {
        initial[r.department_code] = {
          total_participants: String(r.total_participants),
          survey_responses: String(r.survey_responses),
          comments_count: String(r.comments_count),
        };
      });
      setEdits(initial);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const seedMissing = async () => {
    if (!supabase) return;
    const existing = new Set(rows.map(r => r.department_code));
    const missing = DEPT_NAMES.filter(d => !existing.has(d.code));
    if (missing.length === 0) return;
    await supabase.from('department_participation').insert(
      missing.map(d => ({
        department_code: d.code,
        department_name: d.name,
        total_participants: 0,
        survey_responses: 0,
        comments_count: 0,
      }))
    );
    await load();
  };

  useEffect(() => {
    if (!loading && rows.length < DEPT_NAMES.length) seedMissing();
  }, [loading]);

  const setField = (code: string, field: keyof EditState[string], value: string) => {
    setEdits(prev => ({ ...prev, [code]: { ...prev[code], [field]: value } }));
  };

  const saveRow = async (code: string) => {
    if (!supabase) return;
    setSaving(code);
    const e = edits[code];
    const { error } = await supabase
      .from('department_participation')
      .update({
        total_participants: parseInt(e.total_participants) || 0,
        survey_responses: parseInt(e.survey_responses) || 0,
        comments_count: parseInt(e.comments_count) || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('department_code', code);
    setSaving(null);
    setFlash({ code, ok: !error });
    setTimeout(() => setFlash(null), 2500);
    if (!error) { await load(); setMapKey(k => k + 1); }
  };

  const saveAll = async () => {
    if (!supabase) return;
    setBulkSaving(true);
    for (const row of rows) {
      const e = edits[row.department_code];
      if (!e) continue;
      await supabase.from('department_participation').update({
        total_participants: parseInt(e.total_participants) || 0,
        survey_responses: parseInt(e.survey_responses) || 0,
        comments_count: parseInt(e.comments_count) || 0,
        updated_at: new Date().toISOString(),
      }).eq('department_code', row.department_code);
    }
    setBulkSaving(false);
    await load();
    setMapKey(k => k + 1);
  };

  const reset = (code: string) => {
    const original = rows.find(r => r.department_code === code);
    if (!original) return;
    setEdits(prev => ({
      ...prev,
      [code]: {
        total_participants: String(original.total_participants),
        survey_responses: String(original.survey_responses),
        comments_count: String(original.comments_count),
      },
    }));
  };

  const totals = {
    participants: rows.reduce((s, r) => s + r.total_participants, 0),
    surveys: rows.reduce((s, r) => s + r.survey_responses, 0),
    comments: rows.reduce((s, r) => s + r.comments_count, 0),
  };

  const hasDirty = rows.some(r => {
    const e = edits[r.department_code];
    return e && (
      e.total_participants !== String(r.total_participants) ||
      e.survey_responses !== String(r.survey_responses) ||
      e.comments_count !== String(r.comments_count)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Participación Departamental</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Actualiza los datos de participación por departamento. Los cambios se reflejan en el mapa interactivo del sitio público.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                view === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Table2 className="h-3.5 w-3.5" /> Tabla
            </button>
            <button
              onClick={() => setView('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                view === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Map className="h-3.5 w-3.5" /> Vista mapa
            </button>
          </div>

          <button
            onClick={saveAll}
            disabled={bulkSaving || !hasDirty}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {bulkSaving ? 'Guardando…' : 'Guardar todo'}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
            <Users className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total participantes</p>
            <p className="text-xl font-bold text-slate-900">{totals.participants.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
            <ClipboardList className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Encuestas</p>
            <p className="text-xl font-bold text-slate-900">{totals.surveys.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <MessageSquare className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Comentarios</p>
            <p className="text-xl font-bold text-slate-900">{totals.comments.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Map preview view */}
      {view === 'map' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Vista previa del mapa</h3>
              <p className="text-xs text-slate-400 mt-0.5">Muestra los datos guardados en la base de datos.</p>
            </div>
            <button
              onClick={() => setMapKey(k => k + 1)}
              className="flex items-center gap-1.5 text-xs text-brand-700 hover:text-brand-900 font-medium transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Recargar
            </button>
          </div>
          <GuatemalaMap key={mapKey} />
        </div>
      )}

      {/* Table view */}
      {view === 'table' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-[1fr_130px_130px_130px_100px] gap-0 text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 border-b border-slate-100 bg-slate-50">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Departamento</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />Participantes</span>
            <span className="flex items-center gap-1.5"><ClipboardList className="h-3.5 w-3.5" />Encuestas</span>
            <span className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" />Comentarios</span>
            <span>Acciones</span>
          </div>

          {rows.map((row, i) => {
            const e = edits[row.department_code] ?? { total_participants: '0', survey_responses: '0', comments_count: '0' };
            const isDirty =
              e.total_participants !== String(row.total_participants) ||
              e.survey_responses !== String(row.survey_responses) ||
              e.comments_count !== String(row.comments_count);
            const isSaving = saving === row.department_code;
            const rowFlash = flash?.code === row.department_code ? flash : null;

            return (
              <div
                key={row.department_code}
                className={`grid grid-cols-[1fr_130px_130px_130px_100px] gap-0 items-center px-5 py-3 transition-colors ${
                  i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                } ${isDirty ? 'ring-1 ring-inset ring-amber-200 bg-amber-50/30' : ''}`}
              >
                {/* Name */}
                <div className="flex items-center gap-2">
                  {rowFlash && (
                    rowFlash.ok
                      ? <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      : <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                  <span className="text-sm font-medium text-slate-800">{row.department_name}</span>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">{row.department_code}</span>
                </div>

                {/* Participantes */}
                <div className="pr-3">
                  <input
                    type="number"
                    min="0"
                    value={e.total_participants}
                    onChange={ev => setField(row.department_code, 'total_participants', ev.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  />
                </div>

                {/* Encuestas */}
                <div className="pr-3">
                  <input
                    type="number"
                    min="0"
                    value={e.survey_responses}
                    onChange={ev => setField(row.department_code, 'survey_responses', ev.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  />
                </div>

                {/* Comentarios */}
                <div className="pr-3">
                  <input
                    type="number"
                    min="0"
                    value={e.comments_count}
                    onChange={ev => setField(row.department_code, 'comments_count', ev.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => saveRow(row.department_code)}
                    disabled={isSaving || !isDirty}
                    title="Guardar"
                    className="p-1.5 rounded-lg bg-brand-700 text-white hover:bg-brand-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSaving
                      ? <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                      : <Save className="h-3.5 w-3.5" />
                    }
                  </button>
                  <button
                    onClick={() => reset(row.department_code)}
                    disabled={!isDirty}
                    title="Deshacer cambios"
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'table' && (
        <p className="text-xs text-slate-400">
          Los cambios se reflejan en el mapa interactivo del sitio público después de guardar.
          Las filas resaltadas en amarillo tienen cambios sin guardar.
        </p>
      )}
    </div>
  );
}

export default AdminParticipacion