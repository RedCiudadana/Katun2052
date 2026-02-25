import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Filter, Calendar, Download, Heart, TrendingUp, Leaf, Map, Shield } from 'lucide-react';
import { katunService } from '../services/katunService';
import type { Dimension, Document } from '../types/katun';
import AnimatedSection from '../components/AnimatedSection';
import Linea from '../assets/LINEA.png';

const Documents = () => {
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDimension, setSelectedDimension] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dims, docs] = await Promise.all([
          katunService.getDimensions(),
          katunService.getDocuments()
        ]);
        setDimensions(dims);
        setDocuments(docs);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  const getDimensionById = (id: string) => {
    return dimensions.find(d => d.id === id);
  };

  const filteredDocuments = documents.filter(doc => {
    if (selectedDimension !== 'all' && doc.dimension_id !== selectedDimension) {
      return false;
    }
    if (selectedType !== 'all' && doc.document_type !== selectedType) {
      return false;
    }
    return true;
  });

  const documentTypes = Array.from(new Set(documents.map(doc => doc.document_type)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando documentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Documentos Oficiales
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explora los documentos oficiales validados por SEGEPLAN organizados por dimensión
              del Plan Nacional de Desarrollo K'atun 2052.
            </p>
            <div className="flex justify-center my-6">
              <img src={Linea} alt="Separador" />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Por Dimensión
                </label>
                <select
                  value={selectedDimension}
                  onChange={(e) => setSelectedDimension(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas las dimensiones</option>
                  {dimensions.map(dim => (
                    <option key={dim.id} value={dim.id}>
                      {dim.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Por Tipo de Documento
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los tipos</option>
                  {documentTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredDocuments.length} de {documents.length} documentos
            </div>
          </div>
        </AnimatedSection>

        {filteredDocuments.length === 0 ? (
          <AnimatedSection delay={300}>
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron documentos
              </h3>
              <p className="text-gray-600">
                Intenta ajustar los filtros para ver más resultados.
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="space-y-6">
            {filteredDocuments.map((document, index) => {
              const dimension = getDimensionById(document.dimension_id);
              const IconComponent = dimension ? getDimensionIcon(dimension.code) : FileText;

              return (
                <AnimatedSection key={document.id} delay={index * 100}>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            {dimension && (
                              <Link
                                to={`/dimension/${dimension.code}`}
                                className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full mb-2 hover:bg-gray-200 transition-colors"
                              >
                                {dimension.name}
                              </Link>
                            )}
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
                          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {document.document_type}
                          </div>
                          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            Versión {document.version}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
