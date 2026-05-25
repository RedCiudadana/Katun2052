import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Heart, TrendingUp, Leaf, Map, Shield } from 'lucide-react';
import SegeplanLogo from '/images/segeplan-logo.jpg';

const dimensions = [
  { name: 'Bienestar para la Gente',    slug: 'bienestar',  icon: Heart,       color: 'text-blue-500' },
  { name: 'Riqueza para Todos',         slug: 'riqueza',    icon: TrendingUp,  color: 'text-green-500' },
  { name: 'Recursos Naturales',         slug: 'recursos',   icon: Leaf,        color: 'text-teal-500' },
  { name: 'Guatemala Urbana y Rural',   slug: 'territorial',icon: Map,         color: 'text-amber-500' },
  { name: 'Estado Garante',             slug: 'estado',     icon: Shield,      color: 'text-red-500' },
];

const navItems = [
  { name: 'Inicio',         href: '/' },
  { name: 'Documentos',     href: '/documentos' },
  { name: 'Sala de Prensa', href: '/sala-de-prensa' },
  { name: 'Cronograma',     href: '/calendario' },
  { name: 'Encuesta',       href: '/encuesta' },
];

const Header = () => {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dimOpen, setDimOpen]         = useState(false);
  const [dimMobOpen, setDimMobOpen]   = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [topH, setTopH]               = useState(0);
  const topHRef                       = useRef(0);
  const location                      = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= topHRef.current);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const measure = () => {
      const el = document.getElementById('topbar');
      const h = el ? el.getBoundingClientRect().height : 0;
      setTopH(h);
      topHRef.current = h;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => { setMenuOpen(false); setDimOpen(false); }, [location.pathname]);

  const isActive = (href: string) => location.pathname === href;
  const isDimActive = () => location.pathname.startsWith('/dimension-articulos/');

  const linkCls = (active: boolean) =>
    `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      active
        ? 'bg-brand-50 text-brand-700 shadow-sm'
        : 'text-slate-600 hover:text-brand-700 hover:bg-brand-50'
    }`;

  return (
    <header
      style={{ top: scrolled ? 0 : topH }}
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-soft border-b border-slate-200'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-200/60'
      }`}
    >
      <div className="container-wide">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src={SegeplanLogo}
              alt="SEGEPLAN"
              className="h-10 w-auto rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div className="hidden lg:block">
              <div className="text-sm font-bold text-slate-900 leading-tight">SEGEPLAN</div>
              <div className="text-xs text-slate-500 group-hover:text-brand-600 transition-colors">
                K'atun 2032
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.href} to={item.href} className={linkCls(isActive(item.href))}>
                {item.name}
              </Link>
            ))}

            {/* Dimensions dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDimOpen(true)}
              onMouseLeave={() => setDimOpen(false)}
            >
              <button className={linkCls(isDimActive()) + ' flex items-center gap-1'}>
                Dimensiones
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dimOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute top-full right-0 mt-1 w-68 bg-white rounded-2xl shadow-card-hover border border-slate-200 py-2 z-50 transition-all duration-200 ${
                dimOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}>
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    5 Dimensiones del Plan
                  </p>
                </div>
                {dimensions.map(d => {
                  const Icon = d.icon;
                  return (
                    <Link
                      key={d.slug}
                      to={`/dimension-articulos/${d.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-800 transition-colors group"
                    >
                      <Icon className={`h-4 w-4 ${d.color} shrink-0`} />
                      {d.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-brand-700 hover:bg-brand-50 transition-all duration-200"
            aria-label="Menú"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-[600px] opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-slate-100 pt-3 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-700 hover:text-brand-700 hover:bg-brand-50'
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div>
              <button
                onClick={() => setDimMobOpen(!dimMobOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isDimActive()
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-700 hover:text-brand-700 hover:bg-brand-50'
                }`}
              >
                Dimensiones
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dimMobOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${dimMobOpen ? 'max-h-80 mt-1' : 'max-h-0'}`}>
                <div className="pl-4 space-y-1">
                  {dimensions.map(d => {
                    const Icon = d.icon;
                    return (
                      <Link
                        key={d.slug}
                        to={`/dimension-articulos/${d.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:text-brand-700 hover:bg-brand-50 transition-all duration-200"
                      >
                        <Icon className={`h-4 w-4 ${d.color} shrink-0`} />
                        {d.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
