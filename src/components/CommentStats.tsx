import React from 'react';
import { MessageSquare, Users, TrendingUp, Award, Loader2 } from 'lucide-react';
import { useCommentStats } from '../hooks/useComments';

interface CommentStatsProps {
  lawId: string;
  articleId?: string;
}

const CommentStats: React.FC<CommentStatsProps> = ({ lawId, articleId }) => {
  const { stats, loading } = useCommentStats(lawId, articleId);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Cargando estadísticas...</span>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      label: 'Comentarios',
      value: stats.totalComments,
      icon: MessageSquare,
      color: 'text-blue-800',
      bgColor: 'bg-blue-500'
    },
    {
      label: 'Participantes',
      value: stats.uniqueParticipants,
      icon: Users,
      color: 'text-blue-800',
      bgColor: 'bg-blue-500'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Estadísticas de Participación
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {statItems.map((item, index) => {
          const IconComponent = item.icon;
          
          return (
            <div key={index} className="text-center">
              <div className={`${item.bgColor} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                <IconComponent className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {item.value}
              </div>
              <div className="text-sm text-gray-600">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default CommentStats;