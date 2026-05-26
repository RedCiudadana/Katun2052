const HeroSlider = () => (
  <div className="relative min-h-screen overflow-hidden">
    <div className="absolute inset-0">
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="h-full w-full object-cover"
      >
        <source src="/images/Video_Hero.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 via-brand-900/30 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/35 via-transparent to-transparent" />
    </div>

    <div className="absolute top-1/4 right-10 h-72 w-72 rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />
    <div className="absolute bottom-1/4 left-10 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

    <div className="relative z-10 flex min-h-screen flex-col justify-center py-24">
      <div className="container-wide w-full">
        <div className="mx-auto max-w-4xl space-y-10 text-center text-white">
          <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse-slow" />
              Plan Nacional de Desarrollo · SEGEPLAN
            </span>
          </div>

          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              K&apos;atun:
            </h1>
            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-teal-300">Nuestra Guatemala</span>
              <span className="text-white"> 2032</span>
            </h1>
          </div>

          <p
            className="mx-auto max-w-2xl animate-fade-in text-xl leading-relaxed text-white/80 sm:text-2xl"
            style={{ animationDelay: '200ms' }}
          >
            Participa en la actualizacion del Plan Nacional de Desarrollo.
            <span className="mt-2 block font-semibold text-white">
              Tu voz construye el futuro de Guatemala.
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default HeroSlider;
