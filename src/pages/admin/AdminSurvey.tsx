import { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SurveyConfig {
  src: string;
  width: string;
  height: string;
}

const DEFAULT_CONFIG: SurveyConfig = {
  src: 'https://ee.kobotoolbox.org/i/EfHgXxdw',
  width: '800',
  height: '600',
};

const AdminSurvey = () => {
  const [config, setConfig] = useState<SurveyConfig>(DEFAULT_CONFIG);
  const [original, setOriginal] = useState<SurveyConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      if (!supabase) { setLoading(false); return; }
      const { data } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('key', 'survey_embed')
        .maybeSingle();
      if (data?.value) {
        const c = data.value as SurveyConfig;
        setConfig(c);
        setOriginal(c);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({ key: 'survey_embed', value: config, updated_at: new Date().toISOString() });
      if (error) throw error;
      setOriginal(config);
      showToast('Configuración guardada. La encuesta del sitio se actualizará automáticamente.');
    } catch (err: any) {
      showToast(err.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isDirty = JSON.stringify(config) !== JSON.stringify(original);

  if (loading) return (
    <div className="flex items-center gap-2 text-slate-500">
      <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      Cargando configuración…
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-900">Configuración de Encuesta</h2>
        <p className="text-slate-500 text-sm mt-1">
          Configura el embed de KoboToolbox que se muestra en la página de Encuesta.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className="form-label">URL del formulario (src) *</label>
          <input
            type="url" required
            value={config.src}
            onChange={e => setConfig(p => ({ ...p, src: e.target.value }))}
            className="form-input"
            placeholder="https://ee.kobotoolbox.org/i/XXXXXXXX"
          />
          <p className="text-xs text-slate-400 mt-1">
            Copia la URL del atributo <code className="bg-slate-100 px-1 rounded">src</code> del iframe generado por KoboToolbox.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Ancho (width)</label>
            <input
              type="text"
              value={config.width}
              onChange={e => setConfig(p => ({ ...p, width: e.target.value }))}
              className="form-input"
              placeholder="800"
            />
          </div>
          <div>
            <label className="form-label">Alto (height)</label>
            <input
              type="text"
              value={config.height}
              onChange={e => setConfig(p => ({ ...p, height: e.target.value }))}
              className="form-input"
              placeholder="600"
            />
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Vista previa del embed generado
          </p>
          <code className="text-xs text-slate-700 break-all">
            {`<iframe src="${config.src}" width="${config.width}" height="${config.height}"></iframe>`}
          </code>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button type="submit" disabled={saving || !isDirty} className="btn-primary">
            {saving
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando…</>
              : <><Save className="h-4 w-4" /> Guardar configuración</>}
          </button>
          <a
            href="/#/encuesta"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost btn-sm"
          >
            <ExternalLink className="h-4 w-4" /> Ver página Encuesta
          </a>
        </div>
      </form>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-800">
        <p className="font-semibold mb-1">¿Cómo obtener la URL del formulario?</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-700">
          <li>Ingresa a KoboToolbox y abre el formulario deseado.</li>
          <li>Ve a <strong>Deploy</strong> y luego a la sección <strong>Collect data</strong>.</li>
          <li>Selecciona la opción <strong>Enketo webform</strong>.</li>
          <li>Copia la URL que aparece y pégala en el campo de arriba.</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminSurvey;
