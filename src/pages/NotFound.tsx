import { Link } from 'react-router-dom';
import { Home, ArrowLeft, FileQuestion } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div className="max-w-lg mx-auto text-center">
      <AnimatedSection>
        <div className="relative mb-8">
          <div className="text-[9rem] sm:text-[11rem] font-bold text-slate-100 select-none leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-card border border-slate-200 flex items-center justify-center">
              <FileQuestion className="h-12 w-12 text-brand-600" />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={150}>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          Página no encontrada
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Ir al Inicio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver Atrás
          </button>
        </div>
      </AnimatedSection>
    </div>
  </div>
);

export default NotFound;