import { supabase } from '../lib/supabase';

export interface Dimension {
  id: string;
  code: string;
  slug: string;
  name: string;
  description: string;
  full_description: string;
  icon: string;
  color: string;
  order_index: number;
}

export interface DimensionArticle {
  id: string;
  dimension_id: string;
  title: string;
  content: string;
  order_index: number;
  created_at: string;
}

export interface DimensionComment {
  id: string;
  dimension_id: string;
  article_id: string | null;
  author_name: string;
  author_email: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export const dimensionService = {
  async getAllDimensions(): Promise<Dimension[]> {
    const { data, error } = await supabase
      .from('dimensions')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getDimensionBySlug(slug: string): Promise<Dimension | null> {
    const { data, error } = await supabase
      .from('dimensions')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getDimensionArticles(dimensionId: string): Promise<DimensionArticle[]> {
    const { data, error } = await supabase
      .from('dimension_articles')
      .select('*')
      .eq('dimension_id', dimensionId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getGeneralComments(dimensionId: string): Promise<DimensionComment[]> {
    const { data, error } = await supabase
      .from('dimension_comments')
      .select('*')
      .eq('dimension_id', dimensionId)
      .is('article_id', null)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getArticleComments(articleId: string): Promise<DimensionComment[]> {
    const { data, error } = await supabase
      .from('dimension_comments')
      .select('*')
      .eq('article_id', articleId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async submitComment(
    dimensionId: string,
    authorName: string,
    authorEmail: string,
    comment: string,
    articleId?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('dimension_comments')
      .insert({
        dimension_id: dimensionId,
        article_id: articleId || null,
        author_name: authorName,
        author_email: authorEmail,
        comment: comment,
        status: 'pending'
      });

    if (error) throw error;
  },

  async getCommentCount(dimensionId: string, articleId?: string): Promise<number> {
    let query = supabase
      .from('dimension_comments')
      .select('id', { count: 'exact', head: true })
      .eq('dimension_id', dimensionId)
      .eq('status', 'approved');

    if (articleId) {
      query = query.eq('article_id', articleId);
    } else {
      query = query.is('article_id', null);
    }

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  }
};
