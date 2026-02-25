import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Users, MessageSquare, Calendar } from 'lucide-react';
import Slider1 from '../assets/slider/Banner.png';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description1: string;
  description2: string;
  description3?: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  stats?: {
    label: string;
    value: string;
    icon: React.ComponentType<any>;
  }[];
}

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides: Slide[] = [
    {
      id: 'main',
      title: 'Conoce el Proceso de Modernización de las',
      subtitle: 'Contrataciones Públicas',
      description1: 'El Ministerio de Finanzas Públicas, te invita a conocer y dar seguimiento a la transformación del Sistema Nacional de Contrataciones Públicas del Estado guatemalteco.',
      description2: 'Los comentarios y sugerencias que recibimos a través de esta herramienta (durante el tiempo que estuvo disponible), nos ayudaron a crear una propuesta de marco legal más transparente, eficiente y moderno.',
      description3: '',
      image: Slider1,
      ctaText: 'Ver Documentos',
      ctaLink: '/ley/contrataciones-estado',
      secondaryCtaText: 'Ver Video Explicativo',
      secondaryCtaLink: '/calendario'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-transparent"></div> */}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold leading-tight">
                  <span className="block">{currentSlideData.title}</span>
                  <span className="block text-white mt-2">
                    {currentSlideData.subtitle}
                  </span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                  {currentSlideData.description1}
                </p>

                <p className="text-xl sm:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                  {currentSlideData.description2}
                </p>

                <p className="text-xl sm:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                  {currentSlideData.description3}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={currentSlideData.ctaLink}
                  className="group bg-blue-800 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 hover:shadow-xl"
                >
                  {currentSlideData.ctaText}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          {/* Dots */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-blue-800 w-8'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Arrow Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 border border-white/20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 border border-white/20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-white/20 h-1">
          <div
            className="bg-blue-800 h-full transition-all duration-300"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;