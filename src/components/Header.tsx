import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import SegeplanLogo from '/images/segeplan-logo.jpg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDimensionsOpen, setIsDimensionsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [topOffset, setTopOffset] = useState(0);
  const topOffsetRef = useRef(0);
  const location = useLocation();

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Documentos', href: '/documentos' },
    { name: 'Cronograma', href: '/calendario' },
  ];

  const dimensions = [
    { name: 'Bienestar para la Gente', slug: 'bienestar' },
    { name: 'Riqueza para Todos y Todas', slug: 'riqueza' },
    { name: 'Recursos Naturales', slug: 'recursos' },
    { name: 'Guatemala Urbana y Rural', slug: 'territorial' },
    { name: 'Estado Garante', slug: 'estado' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isDimensionActive = () => location.pathname.startsWith('/dimension-articulos/');

  useEffect(() => {
    const handleScroll = () => {
      // when the page has scrolled beyond the topbar, pin header to top
      setIsScrolled(window.scrollY >= (topOffsetRef.current || 0));
    };

    // initialize based on current scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // measure the topbar height so header can sit below it until scrolled
  useEffect(() => {
    const measure = () => {
      const el = document.getElementById('topbar');
      if (el) setTopOffset(el.getBoundingClientRect().height);
      else setTopOffset(0);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // keep a ref in sync so scroll handler reads latest value
  useEffect(() => {
    topOffsetRef.current = topOffset;
  }, [topOffset]);

  return (
    <header
      style={{ top: isScrolled ? 0 : topOffset }}
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white/80 backdrop-blur-sm border-b border-gray-200/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group my-4">
              <img className="h-16 w-auto my-4" src={SegeplanLogo} alt="SEGEPLAN Logo"/>
              <div className="hidden lg:block">
                <div className="text-sm font-bold text-gray-900">SEGEPLAN</div>
                <div className="text-xs text-gray-600">K'atun 2052</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50 shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="relative">
              <button
                onMouseEnter={() => setIsDimensionsOpen(true)}
                onMouseLeave={() => setIsDimensionsOpen(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  isDimensionActive()
                    ? 'text-blue-600 bg-blue-50 shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Dimensiones
                <ChevronDown className={`h-4 w-4 transition-transform ${isDimensionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDimensionsOpen && (
                <div
                  onMouseEnter={() => setIsDimensionsOpen(true)}
                  onMouseLeave={() => setIsDimensionsOpen(false)}
                  className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                >
                  {dimensions.map((dimension) => (
                    <Link
                      key={dimension.slug}
                      to={`/dimension-articulos/${dimension.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {dimension.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-gray-200/50">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="px-4 py-2">
                <button
                  onClick={() => setIsDimensionsOpen(!isDimensionsOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isDimensionActive()
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Dimensiones
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDimensionsOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`transition-all duration-300 overflow-hidden ${
                  isDimensionsOpen ? 'max-h-96 mt-2' : 'max-h-0'
                }`}>
                  <div className="pl-4 space-y-1">
                    {dimensions.map((dimension) => (
                      <Link
                        key={dimension.slug}
                        to={`/dimension-articulos/${dimension.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        {dimension.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;