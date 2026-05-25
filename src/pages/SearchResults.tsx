import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, FileText, Newspaper, BookOpen, Loader2, ArrowRight } from 'lucide-react';

type ResultType = 'document' | 'press' | 'dimension';

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  excerpt: string;
  href: string;
  date?: string;
  tag?: string;
}

const TYPE_LABELS: Record<ResultType, string> = {
  document: 'Documento',
  press: 'Prensa',
  dimension: 'Eje K\'atun',
};

const TYPE_COLORS: Record<ResultType, string> = {
  document: 'bg-blue-50 text-blue-700 border-blue-200',
  press: 'bg-amber-50 text-amber-700 border-amber-200',
  dimension: 'bg-teal-50 text-teal-700 border-teal-200',
};

const TYPE_ICONS: Record<ResultType, typeof FileText> = {
  document: FileText,
  press: Newspaper,
  dimension: BookOpen,
};

const DIMENSION_SLUGS: Record<string, string> = {
  'bienestar': 'bienestar',
  'riqueza': 'riqueza',
  'recursos': 'recursos',
  'territorial': 'territorial',
  'estado': 'estado',
};

function excerpt(text: string, q: string, len = 160): string {
  if (!text) return '';
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  const start = Math.max(0, idx - 60);
  const slice = text.slice(start, start + len);
  return (start > 0 ? '…' : '') + slice + (slice.length === len ? '…' : '');
}

async function runSearch(q: string): Promise<SearchResult[]> {
  if (!supabase || q.trim().length < 2) return [];
  const term = q.trim();
  const results: SearchResult[] = [];

  const [docsRes, pressRes, dimsRes] = await Promise.all([
    supabase
      .from('documents')
      .select('id, title, description, document_type, publication_date')
      .eq('is_published', true)
      .or(`title.ilike.%${term}%,description.ilike.%${term}%`)
      .limit(10),
    supabase
      .from('press_posts')
      .select('id, title, excerpt, slug, published_at')
      .eq('published', true)
      .or(`title.ilike.%${term}%,excerpt.ilike.%${term}%,content.ilike.%${term}%`)
      .limit(10),
    supabase
      .from('dimensions')
      .select('id, name, description, code')
      .eq('is_active', true)
      .or(`name.ilike.%${term}%,description.ilike.%${term}%`)
      .limit(5),
  ]);

  (docsRes.data ?? []).forEach(d => {
    results.push({
      id: d.id,
      type: 'document',
      title: d.title,
      excerpt: excerpt(d.description ?? '', term),
      href: `#/documento/${d.id}`,
      date: d.publication_date,
      tag: d.document_type,
    });
  });

  (pressRes.data ?? []).forEach(p => {
    results.push({
      id: p.id,
      type: 'press',
      title: p.title,
      excerpt: excerpt(p.excerpt ?? '', term),
      href: `#/sala-de-prensa/${p.slug}`,
      date: p.published_at,
    });
  });

  (dimsRes.data ?? []).forEach(d => {
    const slug = DIMENSION_SLUGS[d.code] ?? d.code;
    results.push({
      id: d.id,
      type: 'dimension',
      title: d.name,
      excerpt: excerpt(d.description ?? '', term),
      href: `#/dimension-articulos/${slug}`,
    });
  });

  return results;
}

function highlight(text: string, q: string) {
  if (!q || !text) return text;
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-yellow-100 text-yellow-900 rounded px-0.5">{part}</mark>
      : part
  );
}

function SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [input, setInput] = useState(q);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setInput(q);
    if (!q) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(false);
    runSearch(q).then(r => {
      setResults(r);
      setLoading(false);
      setSearched(true);
    });
  }, [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) setParams({ q: input.trim() });
  };

  const filterType = params.get('tipo') as ResultType | null;
  const filtered = filterType ? results.filter(r => r.type === filterType) : results;

  const counts: Record<ResultType, number> = { document: 0, press: 0, dimension: 0 };
  results.forEach(r => counts[r.type]++);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero search bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-wide py-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Buscar</h1>
          <p className="text-slate-500 text-sm mb-6">
            Encuentra documentos, noticias y ejes del Plan K'atun 2032
          </p>
          <form onSubmit={submit} className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                autoFocus
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="¿Qué estás buscando?"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold rounded-xl transition-colors duration-200 shrink-0"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      <div className="container-wide py-10">
        {loading && (
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Buscando…</span>
          </div>
        )}

        {!loading && searched && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar filters */}
            <aside className="md:w-52 shrink-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Filtrar por tipo
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setParams(p => { const n = new URLSearchParams(p); n.delete('tipo'); return n; })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !filterType ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>Todos</span>
                  <span className="text-xs bg-slate-200 text-slate-600 rounded-full px-2 py-0.5">{results.length}</span>
                </button>
                {(['document', 'press', 'dimension'] as ResultType[]).map(t => {
                  const Icon = TYPE_ICONS[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setParams(p => { const n = new URLSearchParams(p); n.set('tipo', t); return n; })}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterType === t ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" />
                        {TYPE_LABELS[t]}s
                      </span>
                      <span className="text-xs bg-slate-200 text-slate-600 rounded-full px-2 py-0.5">{counts[t]}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-500 mb-5">
                {filtered.length === 0
                  ? `Sin resultados para "${q}"`
                  : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''} para "${q}"`}
              </p>

              {filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium text-slate-500">No encontramos resultados</p>
                  <p className="text-sm mt-1">Intenta con otras palabras clave</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map(r => {
                    const Icon = TYPE_ICONS[r.type];
                    return (
                      <a
                        key={r.id}
                        href={r.href}
                        className="group flex gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all duration-200"
                      >
                        <div className="shrink-0 mt-0.5">
                          <div className="h-9 w-9 rounded-xl bg-slate-100 group-hover:bg-brand-50 flex items-center justify-center transition-colors">
                            <Icon className="h-4 w-4 text-slate-500 group-hover:text-brand-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                              {highlight(r.title, q)}
                            </h3>
                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-600 shrink-0 mt-0.5 transition-colors" />
                          </div>
                          {r.excerpt && (
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2">
                              {highlight(r.excerpt, q)}
                            </p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${TYPE_COLORS[r.type]}`}>
                              {TYPE_LABELS[r.type]}
                            </span>
                            {r.tag && (
                              <span className="text-xs text-slate-400 capitalize">{r.tag}</span>
                            )}
                            {r.date && (
                              <span className="text-xs text-slate-400">
                                {new Date(r.date).toLocaleDateString('es-GT', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !searched && !q && (
          <div className="text-center py-20 text-slate-400">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-slate-500 font-medium">Escribe algo para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
