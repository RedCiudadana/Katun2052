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
          gradient: 'from-blue-500 to-blue-600',
          hover: 'hover:from-blue-600 hover:to-blue-700',
          accent: 'text-blue-800',
          bg: 'bg-blue-500'
        };
      case 'green':
        return {
          gradient: 'from-green-500 to-green-600',
          hover: 'hover:from-green-600 hover:to-green-700',
          accent: 'text-blue-800',
          bg: 'bg-green-50'
        };
      case 'purple':
        return {
          gradient: 'from-purple-500 to-purple-600',
          hover: 'hover:from-purple-600 hover:to-purple-700',
          accent: 'text-blue-800',
          bg: 'bg-purple-50'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <Link to={link} className="group block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} ${colors.hover} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} /> */}
          
          {/* Icon */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Stats Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-white font-semibold text-sm">{stats.comments}</div>
                  <div className="text-white/80 text-xs">Comentarios</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-white font-semibold text-sm">{stats.participants}</div>
                  <div className="text-white/80 text-xs">Participantes</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-white font-semibold text-sm">{stats.daysLeft}</div>
                  <div className="text-white/80 text-xs">Días</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-800 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {description}
          </p>
          
          {/* Action */}
          <div className="flex items-center justify-between">
            <div className={`bg-blue-500 px-3 py-1 rounded-full`}>
              <span className={`text-sm font-medium ${colors.accent}`}>
                Participación activa
              </span>
            </div>
            <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EnhancedCard;