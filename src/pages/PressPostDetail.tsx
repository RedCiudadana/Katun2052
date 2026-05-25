import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, Newspaper } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PressPost } from './SalaDePrensaPage';

const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  noticia:    { bg: 'bg-brand-100', text: 'text-brand-700', label: 'Noticia' },
  blog:       { bg: 'bg-teal-100',  text: 'text-teal-700',  label: 'Blog' },
  comunicado: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Comunicado' },
  evento:     { bg: 'bg-green-100', text: 'text-green-700', label: 'Evento' },
};

const FALLBACK_COVER = 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200';

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('es-GT', { year: 'numeric', month: 'long', day: 'numeric' });

const PressPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PressPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!supabase || !slug) return;
    supabase
      .from('press_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setNotFound(true);
        else setPost(data as PressPost);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-slate-500">
        <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        Cargando…
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="section container-wide text-center py-32">
        <Newspaper className="h-16 w-16 text-slate-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Publicación no encontrada</h2>
        <p className="text-slate-500 mb-6">La publicación que buscas no existe o no está disponible.</p>
        <Link to="/sala-de-prensa" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver a Sala de Prensa
        </Link>
      </div>
    );
  }

  const cat = CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES.noticia;

  return (
    <article>
      {/* Cover */}
      <div className="relative h-72 sm:h-96 lg:h-[480px] overflow-hidden bg-slate-900">
        <img
          src={post.cover_image_url || FALLBACK_COVER}
          alt={post.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white container-wide">
          <Link
            to="/sala-de-prensa"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Sala de Prensa
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cat.bg} ${cat.text}`}>
              {cat.label}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />{post.author_name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />{formatDate(post.published_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="section bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-slate-600 leading-relaxed border-l-4 border-brand-400 pl-5 mb-8 font-medium italic">
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              className="prose prose-slate prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-slate-900
                prose-p:text-slate-700 prose-p:leading-relaxed
                prose-a:text-brand-700 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900
                prose-ul:text-slate-700 prose-ol:text-slate-700
                prose-blockquote:border-brand-400 prose-blockquote:text-slate-600"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-slate-100">
                <div className="flex flex-wrap gap-2 items-center">
                  <Tag className="h-4 w-4 text-slate-400" />
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back */}
            <div className="mt-10">
              <Link
                to="/sala-de-prensa"
                className="inline-flex items-center gap-2 btn-secondary"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Sala de Prensa
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PressPostDetail;
