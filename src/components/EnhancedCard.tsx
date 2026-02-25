import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Users, Clock } from 'lucide-react';

interface EnhancedCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  stats: {
    comments: number;
    participants: number;
    daysLeft: number;
  };
  color: 'blue' | 'green' | 'purple';
  icon: React.ComponentType<any>;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  title,
  description,
  image,
  link,
  stats,
  color,
  icon: IconComponent
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          gradient: 'from-cyan-600 to-cyan-700',
          hover: 'hover:from-cyan-700 hover:to-cyan-800',
          accent: 'text-cyan-800',
          bg: 'bg-cyan-500'
        };
      case 'green':
        return {
          gradient: 'from-emerald-600 to-emerald-700',
          hover: 'hover:from-emerald-700 hover:to-emerald-800',
          accent: 'text-emerald-800',
          bg: 'bg-emerald-50'
        };
      case 'purple':
        return {
          gradient: 'from-blue-600 to-blue-700',
          hover: 'hover:from-blue-700 hover:to-blue-800',
          accent: 'text-blue-800',
          bg: 'bg-blue-50'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <Link to={link} className="group block">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
        {/* Image Header */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Icon */}
          <div className="absolute top-6 left-6">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30 group-hover:scale-110 transition-transform duration-300">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Stats Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="flex items-center justify-center mb-1.5">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-white font-bold text-base">{stats.comments}</div>
                  <div className="text-white/90 text-xs font-medium">Comentarios</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1.5">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-white font-bold text-base">{stats.participants}</div>
                  <div className="text-white/90 text-xs font-medium">Participantes</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1.5">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-white font-bold text-base">{stats.daysLeft}</div>
                  <div className="text-white/90 text-xs font-medium">Días</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-cyan-700 transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-base">
            {description}
          </p>

          {/* Action */}
          <div className="flex items-center justify-between">
            <div className={`${colors.bg} px-4 py-2 rounded-full`}>
              <span className={`text-sm font-semibold ${colors.accent}`}>
                Participación activa
              </span>
            </div>
            <ArrowRight className="h-6 w-6 text-cyan-600 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EnhancedCard;