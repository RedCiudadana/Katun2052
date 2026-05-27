import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Heart, TrendingUp, Leaf, Map, Shield, Search } from 'lucide-react';
import KatunLogo from '../assets/logos/KATUN-03.png';

const dimensions = [
  { name: 'Bienestar para la Gente', slug: 'bienestar', icon: Heart, color: 'text-blue-500' },
  { name: 'Riqueza para Todos y Todas', slug: 'riqueza', icon: TrendingUp, color: 'text-green-500' },
  { name: 'Recursos Naturales para Hoy y para el Futuro', slug: 'recursos', icon: Leaf, color: 'text-teal-500' },
  { name: 'Guatemala Urbana y Rural', slug: 'territorial', icon: Map, color: 'text-amber-500' },
  { name: 'Estado como Garante de los Derechos Humanos', slug: 'estado', icon: Shield, color: 'text-red-500' },
];

const navItems = [
  { name: 'Inicio', href: '/' },
  { name: "Participa", href: '/encuesta' },
  { name: 'Proceso de Actualización', href: '/documentos' },
  { name: 'Sala de Prensa', href: '/sala-de-prensa' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dimOpen, setDimOpen] = useState(false);
  const [dimMobOpen, setDimMobOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const transparentMode = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDimOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
    else setSearchQuery('');
  }, [searchOpen]);

  const isActive = (href: string) => location.pathname === href;
  const isDimActive = () => location.pathname.startsWith('/dimension-articulos/');

  const linkCls = (active: boolean) =>
    `px-3 py-2 text-[0.95rem] font-bold uppercase tracking-wide transition-colors duration-200 ${
      transparentMode
        ? active
          ? 'text-white'
          : 'text-white hover:text-white/85'
        : active
          ? 'text-brand-700'
          : 'text-slate-700 hover:text-brand-700'
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
      style={{ top: 'var(--topbar-h)' }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        transparentMode
          ? 'bg-transparent'
          : 'border-b border-slate-200 bg-white shadow-soft'
      }`}
    >
      <div className="container-wide relative">
        <div className="flex h-16 items-center justify-between md:justify-end">
          <Link
            to="/"
            className={`md:hidden flex items-center rounded-2xl bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.12)] ${
              transparentMode ? '' : ''
            }`}
          >
            <img src={KatunLogo} alt="K'atun 2032" className="h-12 w-auto" />
          </Link>

          <Link
            to="/"
            className="fixed left-0 top-[var(--topbar-h)] hidden w-[176px] rounded-br-[1.9rem] bg-white px-4 pb-6 pt-4 shadow-[0_18px_40px_rgba(15,23,42,0.14)] md:flex"
          >
            <img src={KatunLogo} alt="K'atun 2032" className="h-auto w-full" />
          </Link>

          <nav className={`hidden items-center gap-1 pr-14 md:flex lg:gap-2 ${transparentMode ? 'text-white' : 'text-slate-700'}`}>
            <Link to="/" className={linkCls(isActive('/'))}>Inicio</Link>

            <div
              className="relative"
              onMouseEnter={() => setDimOpen(true)}
              onMouseLeave={() => setDimOpen(false)}
            >
              <button className={`${linkCls(isDimActive())} flex items-center gap-1`}>
                Ejes K'atun
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dimOpen ? 'rotate-180' : ''}`} />
              </button>

              <div
                className={`absolute left-0 top-full mt-3 w-72 rounded-2xl border border-slate-200 bg-white py-2 shadow-card-hover transition-all duration-200 ${
                  dimOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                }`}
              >
                <div className="mb-1 border-b border-slate-100 px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    5 ejes del Plan K'atun
                  </p>
                </div>
                {dimensions.map((d) => {
                  const Icon = d.icon;
                  return (
                    <Link
                      key={d.slug}
                      to={`/dimension-articulos/${d.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-800"
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${d.color}`} />
                      {d.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {navItems.slice(1).map((item) => (
              <Link key={item.href} to={item.href} className={linkCls(isActive(item.href))}>
                {item.name}
              </Link>
            ))}

            <button
              onClick={() => setSearchOpen((s) => !s)}
              className={`ml-3 rounded-full border px-3 py-2 transition-all duration-200 ${
                transparentMode
                  ? 'border-white/35 bg-white/10 text-white hover:bg-white/15'
                  : 'border-slate-200 bg-white text-brand-700 hover:bg-brand-50'
              }`}
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => {
                setSearchOpen((s) => !s);
                setMenuOpen(false);
              }}
              className={`rounded-xl p-2 transition-all duration-200 ${
                transparentMode
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-700 hover:bg-brand-50 hover:text-brand-700'
              }`}
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setSearchOpen(false);
              }}
              className={`rounded-xl p-2 transition-all duration-200 ${
                transparentMode
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-700 hover:bg-brand-50 hover:text-brand-700'
              }`}
              aria-label="Menú"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            searchOpen ? 'max-h-24 opacity-100 pb-3' : 'max-h-0 opacity-0'
          }`}
        >
          <form onSubmit={submitSearch} className="flex gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar documentos, noticias, ejes..."
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-800"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="rounded-xl p-2.5 text-slate-500 transition-colors hover:bg-slate-100"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen ? 'max-h-[600px] opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-1 border-t border-slate-100 bg-white pt-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive('/') ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-brand-50 hover:text-brand-700'
              }`}
            >
              Inicio
            </Link>

            <div>
              <button
                onClick={() => setDimMobOpen(!dimMobOpen)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isDimActive() ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                Ejes K'atun
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dimMobOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${dimMobOpen ? 'mt-1 max-h-80' : 'max-h-0'}`}>
                <div className="space-y-1 pl-4">
                  {dimensions.map((d) => {
                    const Icon = d.icon;
                    return (
                      <Link
                        key={d.slug}
                        to={`/dimension-articulos/${d.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-600 transition-all duration-200 hover:bg-brand-50 hover:text-brand-700"
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${d.color}`} />
                        {d.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive(item.href) ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-brand-50 hover:text-brand-700'
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
