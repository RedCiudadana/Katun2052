import React, { useState, useRef } from 'react';
import { ThumbsUp, MessageSquare, User, Crown, Reply, Flag, Share2, Loader2, Mail } from 'lucide-react';
import { useComments } from '../hooks/useComments';
import { CommentReply } from '../lib/supabase';

interface CommentSectionProps {
  lawId: string;
  articleId?: string;
  isGeneral?: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({ lawId, articleId, isGeneral = false }) => {
  const { comments, replies, loading, userLikes, likeComment, addReply } = useComments(lawId, articleId, isGeneral);
  
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyData, setReplyData] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [submittingReply, setSubmittingReply] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most-liked'>('newest');

  const handleLikeComment = async (commentId: string) => {
    try {
      await likeComment(commentId);
    } catch (error) {
      console.error('Error liking comment:', error);
      alert('Error al votar el comentario. Por favor, inténtalo de nuevo.');
    }
  };

  const startReply = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyData({
      author_name: '',
      author_email: '',
      content: ''
    });
  };

  const handleReply = async (commentId: string) => {
    if (!replyData.content.trim() || !replyData.author_name.trim() || !replyData.author_email.trim()) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    setSubmittingReply(true);
    
    try {
      await addReply(commentId, {
        ...replyData
      });
      
      setReplyData({
        author_name: '',
        author_email: '',
        content: ''
      });
      setReplyingTo(null);
      
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Error al enviar la respuesta. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyData({
      author_name: '',
      author_email: '',
      content: ''
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCommentTypeStyles = (comment: any) => {
    if (comment.is_highlighted) {
      return 'border-l-4 border-l-orange-400 bg-orange-50';
    }
    if (comment.is_expert) {
      return 'border-l-4 border-l-blue-400 bg-blue-50';
    }
    return 'border-l-4 border-l-gray-200 bg-white';
  };

  const getSortedComments = () => {
    const sorted = [...comments];
    switch (sortBy) {
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'most-liked':
        return sorted.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
      default: // newest
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  };

  const isReplyFormValid = replyData.content.trim() && 
                          replyData.author_name.trim() && 
                          replyData.author_email.trim() && 
                          !submittingReply;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando comentarios...</span>
      </div>
    );
  }

  const sortedComments = getSortedComments();

  if (sortedComments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">
          {isGeneral ? 'Aún no hay comentarios generales' : 'Aún no hay comentarios para este artículo'}
        </p>
        <p className="text-sm">
          ¡Sé el primero en compartir tu opinión!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {sortedComments.length} {sortedComments.length === 1 ? 'Comentario' : 'Comentarios'}
        </h3>
        
        {/* Sort Controls */}
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="most-liked">Más votados</option>
          </select>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {sortedComments.map((comment) => (
          <div key={comment.id} className={`rounded-lg p-6 ${getCommentTypeStyles(comment)}`}>
            {/* Comment Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 rounded-full p-2">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{comment.author_name}</span>
                    {comment.is_expert && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Experto
                      </span>
                    )}
                    {comment.is_highlighted && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Destacado
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                  {comment.sector && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {comment.sector === 'sector-ejecutivo' && 'Sector Ejecutivo'}
                        {comment.sector === 'sector-privado' && 'Sector Privado'}
                        {comment.sector === 'sociedad-civil' && 'Sociedad Civil'}
                        {comment.sector === 'academia' && 'Academia'}
                        {comment.sector === 'ciudadano' && 'Ciudadano'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-red-500 p-1">
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Comment Content */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              
              {/* Tags */}
              {comment.tags && comment.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {comment.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Comment Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
                    userLikes.includes(comment.id)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{comment.like_count || 0}</span>
                </button>
                
                <button
                  onClick={() => startReply(comment.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 text-sm transition-colors"
                >
                  <Reply className="h-4 w-4" />
                  <span>Responder</span>
                </button>
              </div>
              
              {comment.reply_count && comment.reply_count > 0 && (
                <span className="text-sm text-gray-500">
                  {comment.reply_count} {comment.reply_count === 1 ? 'respuesta' : 'respuestas'}
                </span>
              )}
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center mb-3">
                    <h4 className="font-medium text-gray-900">Responder al comentario</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <User className="h-4 w-4 inline mr-1" />
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        value={replyData.author_name}
                        onChange={(e) => setReplyData(prev => ({ ...prev, author_name: e.target.value }))}
                        placeholder="Tu nombre completo"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={submittingReply}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        value={replyData.author_email}
                        onChange={(e) => setReplyData(prev => ({ ...prev, author_email: e.target.value }))}
                        placeholder="tu@email.com"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={submittingReply}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tu respuesta *
                    </label>
                    <textarea
                      value={replyData.content}
                      onChange={(e) => setReplyData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Escribe tu respuesta..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      disabled={submittingReply}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={cancelReply}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                      disabled={submittingReply}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleReply(comment.id)}
                      disabled={!isReplyFormValid}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                    >
                      {submittingReply ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Reply className="h-4 w-4 mr-2" />
                          Enviar Respuesta
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            {replies[comment.id] && replies[comment.id].length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                {replies[comment.id].map((reply: CommentReply) => (
                  <div key={reply.id} className="flex space-x-3">
                    <div className={`rounded-full p-2 flex-shrink-0 ${
                      reply.is_moderator ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      <User className={`h-3 w-3 ${
                        reply.is_moderator ? 'text-orange-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-sm font-medium ${
                          reply.is_moderator ? 'text-orange-700' : 'text-gray-900'
                        }`}>
                          {reply.author_name}
                        </span>
                        {reply.is_moderator && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Moderador
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{formatDate(reply.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;