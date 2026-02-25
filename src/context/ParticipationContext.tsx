import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Comment {
  id: string;
  articleId: string;
  lawId: string;
  author: string;
  email?: string;
  content: string;
  timestamp: string;
  votes: number;
  isGeneral?: boolean;
  isHighlighted?: boolean;
  isExpert?: boolean;
  replies?: Reply[];
  tags?: string[];
}

interface Reply {
  id: string;
  commentId: string;
  author: string;
  content: string;
  timestamp: string;
  isModerator?: boolean;
}

interface ParticipationState {
  comments: Comment[];
  userEmail: string | null;
  userComments: string[];
  votedComments: string[];
  commentFilters: {
    sortBy: 'newest' | 'oldest' | 'most-voted' | 'expert';
    showOnly: 'all' | 'expert' | 'highlighted';
  };
}

type ParticipationAction = 
  | { type: 'ADD_COMMENT'; payload: Omit<Comment, 'id' | 'timestamp' | 'votes' | 'replies'> }
  | { type: 'ADD_REPLY'; payload: { commentId: string; author: string; content: string; isModerator?: boolean } }
  | { type: 'VOTE_COMMENT'; payload: { commentId: string } }
  | { type: 'SET_USER_EMAIL'; payload: string }
  | { type: 'ADD_USER_COMMENT'; payload: string }
  | { type: 'SET_COMMENT_FILTERS'; payload: Partial<ParticipationState['commentFilters']> }
  | { type: 'HIGHLIGHT_COMMENT'; payload: { commentId: string } };

const initialState: ParticipationState = {
  comments: [
    {
      id: '1',
      articleId: 'art-1',
      lawId: 'infraestructuras-criticas',
      author: 'María González',
      email: 'maria.gonzalez@email.com',
      content: 'Considero que este artículo debería incluir definiciones más específicas sobre qué constituye infraestructura crítica en el contexto guatemalteco. Es fundamental que tengamos claridad sobre los sectores que se considerarán prioritarios.',
      timestamp: '2024-01-15T10:30:00Z',
      votes: 12,
      tags: ['definiciones', 'sectores-prioritarios'],
      replies: [
        {
          id: 'r1',
          commentId: '1',
          author: 'Equipo Técnico',
          content: 'Gracias por su observación. Hemos tomado nota de la necesidad de mayor especificidad en las definiciones. Esta sugerencia será evaluada para la siguiente versión.',
          timestamp: '2024-01-16T09:15:00Z',
          isModerator: true
        }
      ]
    },
    {
      id: '2',
      articleId: 'art-2',
      lawId: 'infraestructuras-criticas',
      author: 'Carlos López',
      email: 'carlos.lopez@empresa.com',
      content: 'Es importante considerar el impacto en pequeñas empresas que manejan infraestructura básica. Sugiero incluir un período de transición y apoyo técnico para el cumplimiento.',
      timestamp: '2024-01-15T11:45:00Z',
      votes: 8,
      tags: ['pymes', 'periodo-transicion'],
      isExpert: true
    },
    {
      id: '3',
      articleId: 'general',
      lawId: 'proteccion-datos',
      author: 'Ana Morales',
      content: 'Esta ley es fundamental para proteger la privacidad de los ciudadanos guatemaltecos en la era digital. Felicito la iniciativa del Congreso por abrir este espacio de participación.',
      timestamp: '2024-01-16T09:15:00Z',
      votes: 15,
      isGeneral: true,
      isHighlighted: true
    },
    {
      id: '4',
      articleId: 'art-1',
      lawId: 'proteccion-datos',
      author: 'Dr. Roberto Cifuentes',
      content: 'Desde la perspectiva académica, recomiendo alinear este artículo con los estándares internacionales del GDPR europeo, adaptándolos al contexto guatemalteco.',
      timestamp: '2024-01-17T14:20:00Z',
      votes: 18,
      isExpert: true,
      tags: ['gdpr', 'estandares-internacionales']
    },
    {
      id: '5',
      articleId: 'art-3',
      lawId: 'ciberseguridad',
      author: 'Ing. Patricia Morales',
      content: 'La creación del Sistema Nacional de Ciberseguridad es acertada, pero sugiero definir mejor los mecanismos de coordinación interinstitucional.',
      timestamp: '2024-01-18T16:30:00Z',
      votes: 10,
      isExpert: true,
      tags: ['coordinacion-interinstitucional']
    }
  ],
  userEmail: null,
  userComments: [],
  votedComments: [],
  commentFilters: {
    sortBy: 'newest',
    showOnly: 'all'
  }
};

function participationReducer(state: ParticipationState, action: ParticipationAction): ParticipationState {
  switch (action.type) {
    case 'ADD_COMMENT':
      const newComment: Comment = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        votes: 0,
        replies: []
      };
      return {
        ...state,
        comments: [...state.comments, newComment]
      };
    
    case 'ADD_REPLY':
      const newReply: Reply = {
        id: `r${Date.now()}`,
        commentId: action.payload.commentId,
        author: action.payload.author,
        content: action.payload.content,
        timestamp: new Date().toISOString(),
        isModerator: action.payload.isModerator || false
      };
      
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment.id === action.payload.commentId
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      };
    
    case 'VOTE_COMMENT':
      if (state.votedComments.includes(action.payload.commentId)) {
        return state; // Ya votó por este comentario
      }
      
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment.id === action.payload.commentId
            ? { ...comment, votes: comment.votes + 1 }
            : comment
        ),
        votedComments: [...state.votedComments, action.payload.commentId]
      };
    
    case 'SET_USER_EMAIL':
      return {
        ...state,
        userEmail: action.payload
      };
    
    case 'ADD_USER_COMMENT':
      return {
        ...state,
        userComments: [...state.userComments, action.payload]
      };
    
    case 'SET_COMMENT_FILTERS':
      return {
        ...state,
        commentFilters: { ...state.commentFilters, ...action.payload }
      };
    
    case 'HIGHLIGHT_COMMENT':
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment.id === action.payload.commentId
            ? { ...comment, isHighlighted: true }
            : comment
        )
      };
    
    default:
      return state;
  }
}

const ParticipationContext = createContext<{
  state: ParticipationState;
  dispatch: React.Dispatch<ParticipationAction>;
} | null>(null);

export const ParticipationProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(participationReducer, initialState);

  return (
    <ParticipationContext.Provider value={{ state, dispatch }}>
      {children}
    </ParticipationContext.Provider>
  );
};

export const useParticipation = () => {
  const context = useContext(ParticipationContext);
  if (!context) {
    throw new Error('useParticipation must be used within a ParticipationProvider');
  }
  return context;
};

// Utility functions for filtering and sorting comments
export const filterAndSortComments = (
  comments: Comment[],
  filters: ParticipationState['commentFilters']
): Comment[] => {
  let filtered = [...comments];

  // Apply show filter
  switch (filters.showOnly) {
    case 'expert':
      filtered = filtered.filter(comment => comment.isExpert);
      break;
    case 'highlighted':
      filtered = filtered.filter(comment => comment.isHighlighted);
      break;
    default:
      break;
  }

  // Apply sort
  switch (filters.sortBy) {
    case 'oldest':
      filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      break;
    case 'most-voted':
      filtered.sort((a, b) => b.votes - a.votes);
      break;
    case 'expert':
      filtered.sort((a, b) => {
        if (a.isExpert && !b.isExpert) return -1;
        if (!a.isExpert && b.isExpert) return 1;
        return b.votes - a.votes;
      });
      break;
    default: // newest
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      break;
  }

  return filtered;
};