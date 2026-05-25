import { Heart, TrendingUp, Leaf, Map, Shield, ChevronDown } from 'lucide-react';
import Slider1 from '../assets/slider/Banner.png';

const dimensions = [
  { icon: Heart,       name: 'Bienestar',   color: 'bg-blue-500/20 border-blue-400/40 text-blue-100' },
  { icon: TrendingUp,  name: 'Riqueza',     color: 'bg-green-500/20 border-green-400/40 text-green-100' },
  { icon: Leaf,        name: 'Recursos',    color: 'bg-teal-500/20 border-teal-400/40 text-teal-100' },
  { icon: Map,         name: 'Territorial', color: 'bg-amber-500/20 border-amber-400/40 text-amber-100' },
  { icon: Shield,      name: 'Estado',      color: 'bg-red-500/20 border-red-400/40 text-red-100' },
];

const HeroSlider = () => (
  <div className="relative min-h-screen overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <img
        src={Slider1}
        alt="K'atun: Nuestra Guatemala 2032"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/95 via-brand-800/90 to-brand-700/85" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-transparent to-transparent" />
    </div>

    {/* Decorative circles */}
    <div className="absolute top-1/4 right-10 w-72 h-72 rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />
    <div className="absolute bottom-1/4 left-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

    {/* Content */}
    <div className="relative z-10 min-h-screen flex flex-col justify-center py-24">
      <div className="container-wide w-full">
        <div className="max-w-4xl mx-auto text-center text-white space-y-10">

          {/* Label */}
          <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-semibold text-white/90">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse-slow" />
              Plan Nacional de Desarrollo · SEGEPLAN
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              K'atun:
            </h1>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              <span className="text-teal-300">Nuestra Guatemala</span>
              <span className="text-white"> 2032</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            Participa en la actualización del Plan Nacional de Desarrollo.
            <span className="block mt-2 text-white font-semibold">
              Tu voz construye el futuro de Guatemala.
            </span>
          </p>

          {/* Dimension pills */}
          <div
            className="flex flex-wrap justify-center gap-3 animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            {dimensions.map((d, i) => {
              const Icon = d.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-4 py-2 ${d.color} border rounded-full backdrop-blur-sm text-sm font-medium transition-all duration-200 hover:scale-105`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {d.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <span className="text-xs text-white/50 font-medium">Descubre más</span>
        <ChevronDown className="h-5 w-5 text-white/50" />
      </div>
    </div>
  </div>
);

export default HeroSlider;
