import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Comment {
  id: string;
  law_id: string;
  article_id: string;
  author_name: string;
  author_email?: string;
  content: string;
  is_general: boolean;
  is_expert: boolean;
  is_highlighted: boolean;
  tags: string[];
  sector: string;
  created_at: string;
  updated_at: string;
  like_count?: number;
  reply_count?: number;
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_identifier: string;
  created_at: string;
}

export interface CommentReply {
  id: string;
  comment_id: string;
  author_name: string;
  author_email: string;
  content: string;
  is_moderator: boolean;
  created_at: string;
}

// Simple captcha verification
export const verifyCaptcha = (userAnswer: string, correctAnswer: string): boolean => {
  return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
};

// Generate simple math captcha
export const generateCaptcha = (): { question: string; answer: string } => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operations = ['+', '-'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let answer: number;
  let question: string;
  
  if (operation === '+') {
    answer = num1 + num2;
    question = `¿Cuánto es ${num1} + ${num2}?`;
  } else {
    // Ensure positive result for subtraction
    const larger = Math.max(num1, num2);
    const smaller = Math.min(num1, num2);
    answer = larger - smaller;
    question = `¿Cuánto es ${larger} - ${smaller}?`;
  }
  
  return { question, answer: answer.toString() };
};

// Comment operations
export const commentService = {
  // Get comments for a specific law and article
  async getComments(lawId: string, articleId?: string) {
    let query = supabase
      .from('comments_with_stats')
      .select('*')
      .eq('law_id', lawId)
      .order('created_at', { ascending: false });

    if (articleId) {
      query = query.eq('article_id', articleId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Comment[];
  },

  // Get general comments for a law
  async getGeneralComments(lawId: string) {
    const { data, error } = await supabase
      .from('comments_with_stats')
      .select('*')
      .eq('law_id', lawId)
      .eq('is_general', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Comment[];
  },

  // Add a new comment
  async addComment(comment: {
    law_id: string;
    article_id: string;
    author_name: string;
    author_email?: string;
    content: string;
    sector: string;
    is_general?: boolean;
    is_expert?: boolean;
    tags?: string[];
  }) {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select()
      .single();

    if (error) throw error;
    return data as Comment;
  },

  // Like a comment
  async likeComment(commentId: string, userIdentifier: string) {
    const { data, error } = await supabase
      .from('comment_likes')
      .insert([{ comment_id: commentId, user_identifier: userIdentifier }])
      .select()
      .single();

    if (error) throw error;
    return data as CommentLike;
  },

  // Unlike a comment
  async unlikeComment(commentId: string, userIdentifier: string) {
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_identifier', userIdentifier);

    if (error) throw error;
  },

  // Check if user has liked a comment
  async hasUserLiked(commentId: string, userIdentifier: string) {
    const { data, error } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_identifier', userIdentifier)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  // Get user's liked comments
  async getUserLikes(userIdentifier: string) {
    const { data, error } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .eq('user_identifier', userIdentifier);

    if (error) throw error;
    return data.map(like => like.comment_id);
  },

  // Add a reply to a comment
  async addReply(reply: {
    comment_id: string;
    author_name: string;
    author_email: string;
    content: string;
    is_moderator?: boolean;
  }) {
    const { data, error } = await supabase
      .from('comment_replies')
      .insert([reply])
      .select()
      .single();

    if (error) throw error;
    return data as CommentReply;
  },

  // Get replies for a comment
  async getReplies(commentId: string) {
    const { data, error } = await supabase
      .from('comment_replies')
      .select('*')
      .eq('comment_id', commentId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as CommentReply[];
  },

  // Get comment statistics
  async getCommentStats(lawId: string, articleId?: string) {
    let query = supabase
      .from('comments')
      .select('id, author_name, is_expert, is_highlighted')
      .eq('law_id', lawId);

    if (articleId) {
      query = query.eq('article_id', articleId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const totalComments = data.length;
    const uniqueParticipants = new Set(data.map(c => c.author_name)).size;
    const expertComments = data.filter(c => c.is_expert).length;
    const highlightedComments = data.filter(c => c.is_highlighted).length;

    return {
      totalComments,
      uniqueParticipants,
      expertComments,
      highlightedComments
    };
  }
};

// Utility function to generate user identifier
export const getUserIdentifier = () => {
  let identifier = localStorage.getItem('user_identifier');
  if (!identifier) {
    identifier = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('user_identifier', identifier);
  }
  return identifier;
};