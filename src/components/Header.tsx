import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Heart, TrendingUp, Leaf, Map, Shield, Search } from 'lucide-react';
import SegeplanLogo from '/images/segeplan-logo.jpg';

const dimensions = [
  { name: 'Bienestar para la Gente',                                     slug: 'bienestar',   icon: Heart,      color: 'text-blue-500' },
  { name: 'Riqueza para Todos y Todas',                                  slug: 'riqueza',     icon: TrendingUp, color: 'text-green-500' },
  { name: 'Recursos Naturales para Hoy y para el Futuro',                slug: 'recursos',    icon: Leaf,       color: 'text-teal-500' },
  { name: 'Guatemala Urbana y Rural',                                    slug: 'territorial', icon: Map,        color: 'text-amber-500' },
  { name: 'Estado como Garante de los Derechos Humanos',                 slug: 'estado',      icon: Shield,     color: 'text-red-500' },
];

const navItems = [
  { name: 'Inicio',                   href: '/' },
  { name: 'Participa',                href: '/encuesta' },
  { name: 'Proceso de Actualización', href: '/documentos' },
  { name: 'Sala de Prensa',           href: '/sala-de-prensa' },
];

const Header = () => {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dimOpen, setDimOpen]         = useState(false);
  const [dimMobOpen, setDimMobOpen]   = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [topH, setTopH]               = useState(0);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const topHRef                       = useRef(0);
  const searchInputRef                = useRef<HTMLInputElement>(null);
  const location                      = useLocation();
  const navigate                      = useNavigate();

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

  useEffect(() => { setMenuOpen(false); setDimOpen(false); setSearchOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
    else setSearchQuery('');
  }, [searchOpen]);

  const isActive = (href: string) => location.pathname === href;
  const isDimActive = () => location.pathname.startsWith('/dimension-articulos/');

  const linkCls = (active: boolean) =>
    `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      active
        ? 'bg-brand-50 text-brand-700 shadow-sm'
        : 'text-slate-600 hover:text-brand-700 hover:bg-brand-50'
    }`;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    navigate(`/buscar?q=${encodeURIComponent(q)}`);
  };

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
            <Link to="/" className={linkCls(isActive('/'))}>Inicio</Link>

            {/* Ejes K'atun dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDimOpen(true)}
              onMouseLeave={() => setDimOpen(false)}
            >
              <button className={linkCls(isDimActive()) + ' flex items-center gap-1'}>
                Ejes K'atun
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dimOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-card-hover border border-slate-200 py-2 z-50 transition-all duration-200 ${
                dimOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}>
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    5 Ejes del Plan K'atun
                  </p>
                </div>
                {dimensions.map(d => {
                  const Icon = d.icon;
                  return (
                    <Link
                      key={d.slug}
                      to={`/dimension-articulos/${d.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-800 transition-colors"
                    >
                      <Icon className={`h-4 w-4 ${d.color} shrink-0`} />
                      {d.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {navItems.slice(1).map(item => (
              <Link key={item.href} to={item.href} className={linkCls(isActive(item.href))}>
                {item.name}
              </Link>
            ))}

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(s => !s)}
              className={`p-2 rounded-xl transition-all duration-200 ${
                searchOpen
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-500 hover:text-brand-700 hover:bg-brand-50'
              }`}
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>
          </nav>

          {/* Mobile right buttons */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => { setSearchOpen(s => !s); setMenuOpen(false); }}
              className="p-2 rounded-xl text-slate-600 hover:text-brand-700 hover:bg-brand-50 transition-all duration-200"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
              className="p-2 rounded-xl text-slate-600 hover:text-brand-700 hover:bg-brand-50 transition-all duration-200"
              aria-label="Menú"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Expandable search bar */}
        <div className={`overflow-hidden transition-all duration-300 ${
          searchOpen ? 'max-h-20 opacity-100 pb-3' : 'max-h-0 opacity-0'
        }`}>
          <form onSubmit={submitSearch} className="flex gap-2 pt-1">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar documentos, noticias, ejes…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold rounded-xl transition-colors duration-200 shrink-0"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-[600px] opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-slate-100 pt-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/') ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:text-brand-700 hover:bg-brand-50'
              }`}
            >
              Inicio
            </Link>

            <div>
              <button
                onClick={() => setDimMobOpen(!dimMobOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isDimActive()
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-700 hover:text-brand-700 hover:bg-brand-50'
                }`}
              >
                Ejes K'atun
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

            {navItems.slice(1).map(item => (
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
