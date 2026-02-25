import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, Calendar, CheckCircle, Filter, Heart, TrendingUp, Leaf, Map, Shield } from 'lucide-react';
import { katunService } from '../services/katunService';
import type { Dimension, Document } from '../types/katun';
import AnimatedSection from '../components/AnimatedSection';
import Linea from '../assets/LINEA.png';

const DimensionDetail = () => {
  const { dimensionCode } = useParams<{ dimensionCode: string }>();
  const [dimension, setDimension] = useState<Dimension | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      if (!dimensionCode) return;

      try {
        setLoading(true);
        const dim = await katunService.getDimensionByCode(dimensionCode);
        setDimension(dim);

        if (dim) {
          const docs = await katunService.getDocuments({ dimensionId: dim.id });
          setDocuments(docs);
        }
      } catch (error) {
        console.error('Error loading dimension:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dimensionCode]);

  const getDimensionIcon = (code: string) => {
    switch (code) {
      case 'dimension-1': return Heart;
      case 'dimension-2': return TrendingUp;
      case 'dimension-3': return Leaf;
      case 'dimension-4': return Map;
      case 'dimension-5': return Shield;
      default: return FileText;
    }
  };

  const filteredDocuments = filter === 'all'
    ? documents
    : documents.filter(doc => doc.document_type === filter);

  const documentTypes = Array.from(new Set(documents.map(doc => doc.document_type)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!dimension) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dimensión no encontrada</h2>
          <Link to="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = getDimensionIcon(dimension.code);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-6">
                <IconComponent className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {dimension.name}
                </h1>
                <p className="text-blue-100 text-lg">
                  {dimension.description}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Documentos Oficiales
              </h2>
              <p className="text-gray-600">
                {documents.length} documento{documents.length !== 1 ? 's' : ''} disponible{documents.length !== 1 ? 's' : ''}
              </p>
            </div>

            {documentTypes.length > 1 && (
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los documentos</option>
                  {documentTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </AnimatedSection>

        {filteredDocuments.length === 0 ? (
          <AnimatedSection>
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay documentos disponibles
              </h3>
              <p className="text-gray-600">
                Los documentos oficiales se publicarán próximamente.
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="space-y-6">
            {filteredDocuments.map((document, index) => (
              <AnimatedSection key={document.id} delay={index * 100}>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {document.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {document.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 ml-16">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(document.publication_date).toLocaleDateString('es-GT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          Versión {document.version}
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {document.status}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full lg:w-auto">
                      <Link
                        to={`/documento/${document.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors duration-200 flex items-center justify-center"
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        Ver y Comentar
                      </Link>
                      {document.pdf_url && (
                        <a
                          href={document.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold text-center transition-colors duration-200 flex items-center justify-center"
                        >
                          <Download className="h-5 w-5 mr-2" />
                          Descargar PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}

        <AnimatedSection delay={400}>
          <div className="mt-12 bg-blue-50 rounded-xl p-8 border border-blue-100">
            <div className="flex justify-center mb-4">
              <img src={Linea} alt="Separador" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              ¿Cómo Participar?
            </h3>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-6">
              Revisa los documentos oficiales y comparte tu retroalimentación.
              Puedes dejar comentarios generales sobre la dimensión o específicos sobre cada documento.
            </p>
            <div className="flex justify-center">
              <Link
                to={`/dimension/${dimension.code}/feedback`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Dar Retroalimentación General
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default DimensionDetail;
