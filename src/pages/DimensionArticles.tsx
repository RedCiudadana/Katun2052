import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, TrendingUp, Leaf, Map, Shield, BookOpen, ChevronLeft, ChevronRight, Maximize2, Minimize2, Download, Loader2 } from 'lucide-react';
import { dimensionService, Dimension } from '../services/dimensionService';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

const iconMap: Record<string, React.ComponentType<any>> = {
  'heart': Heart,
  'trending-up': TrendingUp,
  'leaf': Leaf,
  'map': Map,
  'shield': Shield
};


// Renders a single PDF page onto a <canvas>
function PdfPage({ doc, pageNum, containerWidth }: {
  doc: any;
  pageNum: number;
  containerWidth: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendering, setRendering] = useState(true);

  useEffect(() => {
    if (!doc || pageNum < 1 || !canvasRef.current) return;
    let cancelled = false;
    setRendering(true);

    doc.getPage(pageNum).then((page: any) => {
      if (cancelled) return;
      const viewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / viewport.width;
      const scaled = page.getViewport({ scale });

      const canvas = canvasRef.current!;
      canvas.width = scaled.width;
      canvas.height = scaled.height;

      const ctx = canvas.getContext('2d')!;
      page.render({ canvasContext: ctx, viewport: scaled }).promise.then(() => {
        if (!cancelled) setRendering(false);
      });
    });

    return () => { cancelled = true; };
  }, [doc, pageNum, containerWidth]);

  return (
    <div className="relative flex-1 flex items-center justify-center bg-white">
      {rendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-auto block" />
    </div>
  );
}

function PdfBookViewer({ url, title }: { url: string; title: string }) {
  // spread = pair index (1-based). Spread 1 = pages 1+2, spread 2 = pages 3+4…
  const [spread, setSpread] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [loadError, setLoadError] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(400);

  const totalSpreads = totalPages ? Math.ceil(totalPages / 2) : 0;
  const leftPage = spread * 2 - 1;        // always odd
  const rightPage = spread * 2;            // even, may exceed totalPages

  // Load the PDF
  useEffect(() => {
    let cancelled = false;
    setPdfDoc(null);
    setLoadError('');
    setTotalPages(0);
    setSpread(1);

    pdfjsLib.getDocument({ url, withCredentials: false }).promise.then(doc => {
      if (!cancelled) {
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
      }
    }).catch(() => {
      if (!cancelled) setLoadError('No se pudo cargar el PDF. Verifica que la URL sea accesible.');
    });

    return () => { cancelled = true; };
  }, [url]);

  // Measure container to size each page canvas correctly
  const measureContainer = useCallback(() => {
    if (!containerRef.current) return;
    // Each page takes roughly half of the book area minus spine/padding
    const w = Math.floor((containerRef.current.offsetWidth - 48) / 2);
    setPageWidth(Math.max(200, w));
  }, []);

  useEffect(() => {
    measureContainer();
    const ro = new ResizeObserver(measureContainer);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measureContainer, fullscreen]);

  const prevSpread = () => setSpread(s => Math.max(1, s - 1));
  const nextSpread = () => setSpread(s => Math.min(totalSpreads || s, s + 1));

  const pageLabel = totalPages
    ? rightPage <= totalPages
      ? `Páginas ${leftPage}–${rightPage} de ${totalPages}`
      : `Página ${leftPage} de ${totalPages}`
    : 'Cargando…';

  return (
    <div className={fullscreen ? 'fixed inset-0 z-50 bg-slate-950 flex flex-col' : 'relative'}>
      {/* ── Toolbar ── */}
      <div className={`flex items-center gap-3 px-5 py-3 ${fullscreen ? 'bg-slate-900' : 'bg-slate-900 rounded-t-2xl'} text-white shrink-0`}>
        <BookOpen className="h-4 w-4 text-brand-400 shrink-0" />
        <span className="text-sm font-semibold truncate flex-1">{title}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={prevSpread} disabled={spread <= 1}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors" aria-label="Páginas anteriores">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-slate-300 min-w-[130px] text-center">{pageLabel}</span>
          <button onClick={nextSpread} disabled={!totalSpreads || spread >= totalSpreads}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors" aria-label="Páginas siguientes">
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="w-px h-4 bg-white/20 mx-1" />
          <a href={url} download className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" aria-label="Descargar PDF">
            <Download className="h-4 w-4" />
          </a>
          <button onClick={() => setFullscreen(f => !f)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}>
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── Book stage ── */}
      <div
        className={`${fullscreen ? 'flex-1' : 'h-[620px]'} bg-slate-800 flex items-center justify-center px-6 py-6 ${!fullscreen ? 'rounded-b-2xl' : ''} overflow-hidden`}
        ref={containerRef}
      >
        {loadError ? (
          <p className="text-red-300 text-sm text-center max-w-xs">{loadError}</p>
        ) : !pdfDoc ? (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-sm">Cargando documento…</span>
          </div>
        ) : (
          /* ── Open-book spread ── */
          <div className="flex h-full items-stretch gap-0"
            style={{ maxHeight: '100%', width: '100%', maxWidth: pageWidth * 2 + 48 }}>

            {/* Left page */}
            <div className="flex-1 flex flex-col overflow-hidden rounded-l-sm"
              style={{
                boxShadow: '-4px 0 12px rgba(0,0,0,0.5), inset -6px 0 18px rgba(0,0,0,0.15)',
              }}>
              <PdfPage doc={pdfDoc} pageNum={leftPage} containerWidth={pageWidth} />
              <div className="bg-white text-center text-[10px] text-slate-400 py-1 border-t border-slate-100 shrink-0">
                {leftPage}
              </div>
            </div>

            {/* Book spine */}
            <div className="w-3 shrink-0 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400"
              style={{ boxShadow: '0 0 8px rgba(0,0,0,0.6)' }} />

            {/* Right page */}
            <div className="flex-1 flex flex-col overflow-hidden rounded-r-sm"
              style={{
                boxShadow: '4px 0 12px rgba(0,0,0,0.5), inset 6px 0 18px rgba(0,0,0,0.15)',
              }}>
              {rightPage <= totalPages ? (
                <>
                  <PdfPage doc={pdfDoc} pageNum={rightPage} containerWidth={pageWidth} />
                  <div className="bg-white text-center text-[10px] text-slate-400 py-1 border-t border-slate-100 shrink-0">
                    {rightPage}
                  </div>
                </>
              ) : (
                /* blank back page for last odd-page docs */
                <div className="flex-1 bg-slate-50 rounded-r-sm" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom nav (non-fullscreen) ── */}
      {!fullscreen && (
        <div className="flex items-center justify-center gap-4 pt-4 pb-1">
          <button onClick={prevSpread} disabled={spread <= 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <span className="text-sm text-slate-500">{pageLabel}</span>
          <button onClick={nextSpread} disabled={!totalSpreads || spread >= totalSpreads}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 transition-colors">
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

const DimensionArticles = () => {
  const { slug } = useParams<{ slug: string }>();
  const [dimension, setDimension] = useState<Dimension | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDimensionData();
  }, [slug]);

  const loadDimensionData = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const dimensionData = await dimensionService.getDimensionBySlug(slug);
      if (dimensionData) setDimension(dimensionData);
    } catch (error) {
      console.error('Error loading dimension:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!dimension) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Dimensión no encontrada</h2>
        <Link to="/" className="btn-primary btn-sm">Volver al inicio</Link>
      </div>
    </div>
  );

  const IconComponent = iconMap[dimension.icon] || FileText;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="page-hero">
        <div className="container-wide">
          <Link to="/" className="inline-flex items-center gap-2 text-brand-200 hover:text-white text-sm font-medium mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center shrink-0">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{dimension.name}</h1>
              <p className="text-brand-100 text-base max-w-2xl">{dimension.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Book Viewer */}
      <div className="container-wide py-8">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-600" />
          <h2 className="text-lg font-bold text-slate-900">
            {dimension.pdf_title || 'Documento del Eje'}
          </h2>
        </div>
        {dimension.pdf_url ? (
          <PdfBookViewer
            url={dimension.pdf_url}
            title={dimension.pdf_title || dimension.name}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-1">Documento no disponible aún</p>
              <p className="text-sm text-slate-400 max-w-xs">
                El administrador puede subir el PDF de este eje desde{' '}
                <span className="font-medium text-brand-600">Panel Admin → Ejes K'atun</span>.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default DimensionArticles;
