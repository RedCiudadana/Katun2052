import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Settings, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Stats {
  documents: number;
  comments: number;
  actors: Record<string, number>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ documents: 0, comments: 0, actors: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!supabase) return;
      const [docsRes, fbRes] = await Promise.all([
        supabase.from('documents').select('id', { count: 'exact', head: true }),
        supabase.from('feedback').select('id, actor_type'),
      ]);
      const actors: Record<string, number> = {};
      (fbRes.data || []).forEach((f: any) => {
        actors[f.actor_type] = (actors[f.actor_type] || 0) + 1;
      });
      setStats({
        documents: docsRes.count || 0,
        comments: fbRes.data?.length || 0,
        actors,
      });
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: 'Documentos', value: stats.documents, icon: FileText,     to: '/admin/documentos',  color: 'bg-blue-50 text-blue-700' },
    { label: 'Comentarios', value: stats.comments, icon: MessageSquare, to: '/admin/comentarios', color: 'bg-green-50 text-green-700' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Resumen</h2>
        <p className="text-slate-500 text-sm mt-1">Vista general de la plataforma K'atun 2032</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-500">
          <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          Cargando estadísticas…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map(c => {
              const Icon = c.icon;
              return (
                <Link key={c.to} to={c.to} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-brand-300 transition-colors flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${c.color}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900">{c.value}</div>
                    <div className="text-slate-500 text-sm">{c.label}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {Object.keys(stats.actors).length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="h-5 w-5 text-brand-700" />
                <h3 className="font-bold text-slate-900">Comentarios por tipo de actor</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(stats.actors).sort(([,a],[,b]) => b - a).map(([actor, count]) => {
                  const pct = Math.round((count / stats.comments) * 100);
                  return (
                    <div key={actor}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700 font-medium">{actor}</span>
                        <span className="text-slate-500">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-brand-700" />
              <h3 className="font-bold text-slate-900">Acciones rápidas</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/documentos" className="btn-primary btn-sm">
                <FileText className="h-4 w-4" /> Subir documento
              </Link>
              <Link to="/admin/comentarios" className="btn-secondary btn-sm">
                <MessageSquare className="h-4 w-4" /> Exportar comentarios
              </Link>
              <Link to="/admin/encuesta" className="btn-secondary btn-sm">
                <Settings className="h-4 w-4" /> Configurar encuesta
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
