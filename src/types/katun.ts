export interface Dimension {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface Document {
  id: string;
  dimension_id: string;
  title: string;
  description: string;
  document_type: string;
  version: string;
  status: string;
  pdf_url: string;
  publication_date: string;
  sections: DocumentSection[];
  metadata: Record<string, any>;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentSection {
  id: string;
  title: string;
  order: number;
  page_start?: number;
  page_end?: number;
}

export interface Feedback {
  id: string;
  document_id: string;
  dimension_id: string;
  section_id?: string;
  author_name?: string;
  author_email?: string;
  actor_type: ActorType;
  content: string;
  thematic_tags: string[];
  is_general: boolean;
  attachments: Attachment[];
  is_highlighted: boolean;
  is_reviewed: boolean;
  created_at: string;
  updated_at: string;
  like_count?: number;
  reply_count?: number;
}

export interface StructuredResponse {
  id: string;
  dimension_id: string;
  document_id?: string;
  author_name?: string;
  author_email?: string;
  actor_type: ActorType;
  responses: Record<string, string>;
  scale_responses: Record<string, number>;
  attachments: Attachment[];
  created_at: string;
}

export interface FeedbackLike {
  id: string;
  feedback_id: string;
  user_identifier: string;
  created_at: string;
}

export interface FeedbackReply {
  id: string;
  feedback_id: string;
  author_name: string;
  author_email: string;
  content: string;
  is_moderator: boolean;
  created_at: string;
}

export interface ProcessMilestone {
  id: string;
  title: string;
  description: string;
  milestone_date: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  milestone_type: 'publication' | 'consultation' | 'deadline' | 'event';
  related_dimension_id?: string;
  order_index: number;
  is_visible: boolean;
  created_at: string;
}

export interface Attachment {
  name: string;
  url: string;
  size: number;
  type: string;
}

export type ActorType =
  | 'Ciudadano'
  | 'Academia'
  | 'Sociedad Civil'
  | 'Sector Privado'
  | 'Otro';

export const THEMATIC_TAGS = [
  'Gobernanza',
  'Desarrollo Territorial',
  'Institucionalidad',
  'Prospectiva',
  'Monitoreo',
  'Participación',
  'Otro'
] as const;

export type ThematicTag = typeof THEMATIC_TAGS[number];

export const ACTOR_TYPES: ActorType[] = [
  'Ciudadano',
  'Academia',
  'Sociedad Civil',
  'Sector Privado',
  'Otro'
];
