import React, { useState } from 'react';
import { Send, User, Mail, Loader2 } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (data: {
    author_name: string;
    author_email?: string;
    content: string;
    is_expert?: boolean;
    tags?: string[];
    sector: string;
  }) => Promise<void>;
  isGeneral?: boolean;
  loading?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({ 
  onSubmit,
  isGeneral = false,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: '',
    tags: '',
    is_expert: false,
    sector: '',
    sector_other: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim() || !formData.author_name.trim()) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    setIsSubmitting(true);

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await onSubmit({
        author_name: formData.author_name,
        author_email: formData.author_email || undefined,
        content: formData.content,
        is_expert: formData.is_expert,
        tags: tags.length > 0 ? tags : undefined,
        sector: formData.sector === 'otros' ? (formData.sector_other || 'Otros') : formData.sector
      });

      // Reset form but keep email for convenience
      setFormData(prev => ({
        author_name: '',
        author_email: prev.author_email,
        content: '',
        tags: '',
        is_expert: false,
        sector: '',
        sector_other: ''
      }));
      setShowAdvanced(false);
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Error al enviar el comentario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.content.trim() && 
                     formData.author_name.trim() && 
                     (formData.sector.trim() && (formData.sector !== 'otros' || formData.sector_other.trim())) && 
                     formData.content.length >= 10 && 
                     !isSubmitting && 
                     !loading;

  return (
    <div>
    </div>
  );
};

export default CommentForm;