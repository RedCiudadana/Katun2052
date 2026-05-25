import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowRight, Search, Newspaper, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AnimatedSection from '../components/AnimatedSection';
import Linea from '../assets/LINEA.png';

export interface PressPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  author_name: string;
  published_at: string;
  is_published: boolean;
  is_featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  noticia:     { bg: 'bg-brand-100',  text: 'text-brand-700',  label: 'Noticia' },
  blog:        { bg: 'bg-teal-100',   text: 'text-teal-700',   label: 'Blog' },
  comunicado:  { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Comunicado' },
  evento:      { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Evento' },
};

const FALLBACK_COVER = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800';

const CATEGORIES = ['todos', 'noticia', 'blog', 'comunicado', 'evento'];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' });

const SalaDePrensaPage = () => {
  const [posts, setPosts] = useState<PressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('press_posts')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setPosts((data as PressPost[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = posts.filter(p => {
    const matchCat = activeCategory === 'todos' || p.category === activeCategory;
    const q = query.toLowerCase();
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const featured = filtered.find(p => p.is_featured);
  const rest = filtered.filter(p => !p.is_featured || filtered.indexOf(p) > 0);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-20">
        <div className="container-wide text-center text-white space-y-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-semibold">
            <Newspaper className="h-4 w-4" />
            Comunicación institucional
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold">Sala de Prensa</h1>
          <p className="text-lg text-white/75 max-w-xl mx-auto">
            Noticias, blogs y comunicados oficiales del proceso de actualización del Plan Nacional de Desarrollo K'atun 2032.
          </p>
        </div>
      </div>

      <div className="section bg-slate-50">
        <div className="container-wide space-y-10">

          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Buscar noticias…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
                    activeCategory === cat
                      ? 'bg-brand-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-400 hover:text-brand-700'
                  }`}
                >
                  {cat === 'todos' ? 'Todos' : CATEGORY_STYLES[cat]?.label ?? cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 text-slate-500 py-16 justify-center">
              <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
              Cargando publicaciones…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Newspaper className="h-14 w-14 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No se encontraron publicaciones.</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <AnimatedSection>
                  <Link
                    to={`/sala-de-prensa/${featured.slug}`}
                    className="group relative block rounded-3xl overflow-hidden shadow-card-hover hover:shadow-hero transition-shadow"
                  >
                    <div className="relative h-72 sm:h-96">
                      <img
                        src={featured.cover_image_url || FALLBACK_COVER}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CATEGORY_STYLES[featured.category]?.bg} ${CATEGORY_STYLES[featured.category]?.text}`}>
                          {CATEGORY_STYLES[featured.category]?.label}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-amber-300 font-semibold">
                          <Star className="h-3.5 w-3.5" fill="currentColor" /> Destacado
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold leading-snug mb-2 max-w-2xl">
                        {featured.title}
                      </h2>
                      <p className="text-white/75 text-sm line-clamp-2 max-w-xl mb-4">{featured.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{featured.author_name}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(featured.published_at)}</span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post, i) => {
                    const cat = CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES.noticia;
                    return (
                      <AnimatedSection key={post.id} delay={i * 60}>
                        <Link
                          to={`/sala-de-prensa/${post.slug}`}
                          className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft hover:shadow-card-hover transition-shadow flex flex-col h-full"
                        >
                          <div className="relative h-44 overflow-hidden bg-slate-100">
                            <img
                              src={post.cover_image_url || FALLBACK_COVER}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${cat.bg} ${cat.text}`}>
                              {cat.label}
                            </span>
                            {post.is_featured && (
                              <Star className="absolute top-3 right-3 h-4 w-4 text-amber-400" fill="currentColor" />
                            )}
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed flex-1 line-clamp-3 mb-4">
                              {post.excerpt}
                            </p>
                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {post.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                    <Tag className="h-2.5 w-2.5" />{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                              <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author_name}</span>
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(post.published_at)}</span>
                            </div>
                          </div>
                        </Link>
                      </AnimatedSection>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaDePrensaPage;
