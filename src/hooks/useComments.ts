import { useState, useEffect } from 'react';
import { commentService, Comment, CommentReply, getUserIdentifier } from '../lib/supabase';

export const useComments = (lawId: string, articleId?: string, isGeneral?: boolean) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Record<string, CommentReply[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLikes, setUserLikes] = useState<string[]>([]);

  const userIdentifier = getUserIdentifier();

  const loadComments = async () => {
    try {
      setLoading(true);
      let data: Comment[];
      
      if (isGeneral) {
        data = await commentService.getGeneralComments(lawId);
      } else if (articleId) {
        data = await commentService.getComments(lawId, articleId);
      } else {
        data = await commentService.getComments(lawId);
      }
      
      setComments(data);

      // Load replies for each comment
      const repliesData: Record<string, CommentReply[]> = {};
      for (const comment of data) {
        const commentReplies = await commentService.getReplies(comment.id);
        if (commentReplies.length > 0) {
          repliesData[comment.id] = commentReplies;
        }
      }
      setReplies(repliesData);

      // Load user likes
      const likes = await commentService.getUserLikes(userIdentifier);
      setUserLikes(likes);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (commentData: {
    author_name: string;
    author_email?: string;
    content: string;
    is_expert?: boolean;
    tags?: string[];
    sector: string;
  }) => {
    try {
      const newComment = await commentService.addComment({
        law_id: lawId,
        article_id: articleId || 'general',
        is_general: isGeneral || false,
        ...commentData
      });

      // Add the new comment to the list with default stats
      setComments(prev => [{
        ...newComment,
        like_count: 0,
        reply_count: 0
      }, ...prev]);

      return newComment;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error adding comment');
    }
  };

  const likeComment = async (commentId: string) => {
    try {
      const hasLiked = userLikes.includes(commentId);
      
      if (hasLiked) {
        await commentService.unlikeComment(commentId, userIdentifier);
        setUserLikes(prev => prev.filter(id => id !== commentId));
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, like_count: (comment.like_count || 0) - 1 }
            : comment
        ));
      } else {
        await commentService.likeComment(commentId, userIdentifier);
        setUserLikes(prev => [...prev, commentId]);
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, like_count: (comment.like_count || 0) + 1 }
            : comment
        ));
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error updating like');
    }
  };

  const addReply = async (commentId: string, replyData: {
    author_name: string;
    author_email: string;
    content: string;
    is_moderator?: boolean;
  }) => {
    try {

      const newReply = await commentService.addReply({
        comment_id: commentId,
        author_name: replyData.author_name,
        author_email: replyData.author_email,
        content: replyData.content,
        is_moderator: replyData.is_moderator
      });

      // Add reply to local state
      setReplies(prev => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), newReply]
      }));

      // Update reply count
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, reply_count: (comment.reply_count || 0) + 1 }
          : comment
      ));

      return newReply;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error adding reply');
    }
  };

  useEffect(() => {
    loadComments();
  }, [lawId, articleId, isGeneral]);

  return {
    comments,
    replies,
    loading,
    error,
    userLikes,
    addComment,
    likeComment,
    addReply,
    refetch: loadComments
  };
};

export const useCommentStats = (lawId: string, articleId?: string) => {
  const [stats, setStats] = useState({
    totalComments: 0,
    uniqueParticipants: 0,
    expertComments: 0,
    highlightedComments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await commentService.getCommentStats(lawId, articleId);
        setStats(data);
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [lawId, articleId]);

  return { stats, loading };
};