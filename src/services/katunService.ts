import { supabase } from '../lib/supabase';
import type {
  Dimension,
  Document,
  Feedback,
  StructuredResponse,
  FeedbackLike,
  FeedbackReply,
  ProcessMilestone
} from '../types/katun';

export const katunService = {
  async getDimensions(): Promise<Dimension[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('dimensions')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as Dimension[];
  },

  async getDimensionByCode(code: string): Promise<Dimension | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('dimensions')
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (error) throw error;
    return data as Dimension | null;
  },

  async getDocuments(filters?: {
    dimensionId?: string;
    documentType?: string;
    status?: string;
  }): Promise<Document[]> {
    if (!supabase) return [];

    let query = supabase
      .from('documents')
      .select('*')
      .eq('is_published', true)
      .order('publication_date', { ascending: false });

    if (filters?.dimensionId) {
      query = query.eq('dimension_id', filters.dimensionId);
    }
    if (filters?.documentType) {
      query = query.eq('document_type', filters.documentType);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Document[];
  },

  async getDocumentById(id: string): Promise<Document | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Document | null;
  },

  async getFeedback(filters?: {
    documentId?: string;
    dimensionId?: string;
    sectionId?: string;
  }): Promise<Feedback[]> {
    if (!supabase) return [];

    let query = supabase
      .from('feedback_with_stats')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.documentId) {
      query = query.eq('document_id', filters.documentId);
    }
    if (filters?.dimensionId) {
      query = query.eq('dimension_id', filters.dimensionId);
    }
    if (filters?.sectionId) {
      query = query.eq('section_id', filters.sectionId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Feedback[];
  },

  async submitFeedback(feedback: {
    document_id: string;
    dimension_id: string;
    section_id?: string;
    author_name?: string;
    author_email?: string;
    actor_type: string;
    content: string;
    thematic_tags?: string[];
    is_general?: boolean;
  }): Promise<Feedback> {
    if (!supabase) throw new Error('Database not available');

    const { data, error } = await supabase
      .from('feedback')
      .insert([feedback])
      .select()
      .single();

    if (error) throw error;
    return data as Feedback;
  },

  async submitStructuredResponse(response: {
    dimension_id: string;
    document_id?: string;
    author_name?: string;
    author_email?: string;
    actor_type: string;
    responses: Record<string, string>;
    scale_responses?: Record<string, number>;
  }): Promise<StructuredResponse> {
    if (!supabase) throw new Error('Database not available');

    const { data, error } = await supabase
      .from('structured_responses')
      .insert([response])
      .select()
      .single();

    if (error) throw error;
    return data as StructuredResponse;
  },

  async likeFeedback(feedbackId: string, userIdentifier: string): Promise<FeedbackLike> {
    if (!supabase) throw new Error('Database not available');

    const { data, error } = await supabase
      .from('feedback_likes')
      .insert([{ feedback_id: feedbackId, user_identifier: userIdentifier }])
      .select()
      .single();

    if (error) throw error;
    return data as FeedbackLike;
  },

  async unlikeFeedback(feedbackId: string, userIdentifier: string): Promise<void> {
    if (!supabase) throw new Error('Database not available');

    const { error } = await supabase
      .from('feedback_likes')
      .delete()
      .eq('feedback_id', feedbackId)
      .eq('user_identifier', userIdentifier);

    if (error) throw error;
  },

  async getUserLikes(userIdentifier: string): Promise<string[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('feedback_likes')
      .select('feedback_id')
      .eq('user_identifier', userIdentifier);

    if (error) throw error;
    return data.map(like => like.feedback_id);
  },

  async addFeedbackReply(reply: {
    feedback_id: string;
    author_name: string;
    author_email: string;
    content: string;
    is_moderator?: boolean;
  }): Promise<FeedbackReply> {
    if (!supabase) throw new Error('Database not available');

    const { data, error } = await supabase
      .from('feedback_replies')
      .insert([reply])
      .select()
      .single();

    if (error) throw error;
    return data as FeedbackReply;
  },

  async getFeedbackReplies(feedbackId: string): Promise<FeedbackReply[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('feedback_replies')
      .select('*')
      .eq('feedback_id', feedbackId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as FeedbackReply[];
  },

  async getProcessMilestones(): Promise<ProcessMilestone[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('process_milestones')
      .select('*')
      .eq('is_visible', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data as ProcessMilestone[];
  },

  async getFeedbackStats(filters?: {
    documentId?: string;
    dimensionId?: string;
  }): Promise<{
    totalFeedback: number;
    uniqueParticipants: number;
    byActorType: Record<string, number>;
    byThematicTag: Record<string, number>;
  }> {
    if (!supabase) {
      return {
        totalFeedback: 0,
        uniqueParticipants: 0,
        byActorType: {},
        byThematicTag: {}
      };
    }

    let query = supabase
      .from('feedback')
      .select('id, author_email, actor_type, thematic_tags');

    if (filters?.documentId) {
      query = query.eq('document_id', filters.documentId);
    }
    if (filters?.dimensionId) {
      query = query.eq('dimension_id', filters.dimensionId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const uniqueEmails = new Set(data.filter(f => f.author_email).map(f => f.author_email));

    const byActorType: Record<string, number> = {};
    const byThematicTag: Record<string, number> = {};

    data.forEach(feedback => {
      byActorType[feedback.actor_type] = (byActorType[feedback.actor_type] || 0) + 1;

      feedback.thematic_tags?.forEach((tag: string) => {
        byThematicTag[tag] = (byThematicTag[tag] || 0) + 1;
      });
    });

    return {
      totalFeedback: data.length,
      uniqueParticipants: uniqueEmails.size,
      byActorType,
      byThematicTag
    };
  }
};
