import { useEffect, useState } from 'react';

const slides = [
  {
    title: '¿Qué es el Plan Nacional de Desarrollo?',
    text:
      'Es la guía que ayuda a un país a decidir hacia dónde se quiere avanzar y cómo lograrlo; enfocada a mejorar la calidad de vida de las personas en temas como salud, educación, empleo, infraestructura y medio ambiente.',
  },
  {
    title: '¿Por qué necesitamos actualizar el Plan Nacional de Desarrollo?',
    text:
      'Guatemala y el mundo cambiaron, nuestros problemas y metas también. ¡Actualicemos el Plan Nacional de Desarrollo para que tu voz sea el motor de la Guatemala del 2052!',
  },
  {
    title: '¡Actualicemos el Plan Nacional de Desarrollo!',
    text:
      'Participa, porque tu voz es el motor de la Guatemala del 2052: el país que soñamos hoy será la realidad de las futuras generaciones.',
  },
];

const HeroSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-100px)] overflow-hidden">
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

      <div className="relative z-10 flex min-h-[calc(100vh-100px)] flex-col justify-center py-0">
        <div className="container-wide w-full">
          <div className="mx-auto max-w-2xl space-y-10 text-left text-white">
            <div className="relative min-h-[18rem] sm:min-h-[20rem]">
              {slides.map((slide, index) => (
                <div
                  key={slide.title}
                  className={`inset-0 transition-opacity duration-700 ${
                    index === activeSlide ? 'opacity-100' : 'pointer-events-none absolute opacity-0'
                  }`}
                >
                  <div className="max-w-2xl space-y-3">
                    <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-5xl">
                      {slide.title}
                    </h1>
                  </div>

                  <p className="mt-10 max-w-2xl text-xl leading-relaxed text-white/80 sm:text-2xl">
                    {slide.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeSlide ? 'w-10 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'
                  }`}
                  aria-label={`Ver slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
