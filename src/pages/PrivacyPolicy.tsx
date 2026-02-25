import React from 'react';
import { Shield, Lock, Eye, UserCheck, FileText, AlertCircle } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import Linea from '../assets/LINEA.png';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Información que Recolectamos',
      content: [
        'Nombre (opcional): Para identificar tus aportes públicamente si así lo deseas.',
        'Correo electrónico (opcional): Para enviar confirmaciones y actualizaciones relacionadas con tu participación.',
        'Tipo de actor: Para analizar la diversidad de participantes (ciudadano, academia, sociedad civil, sector privado, otro).',
        'Contenido de retroalimentación: Comentarios, propuestas y respuestas a consultas estructuradas.',
        'Datos técnicos: Dirección IP, navegador y sistema operativo para fines de seguridad y estadísticas agregadas.'
      ]
    },
    {
      icon: Lock,
      title: 'Cómo Usamos tu Información',
      content: [
        'Publicación de aportes: Tu nombre y comentarios pueden ser visibles públicamente en la plataforma, salvo que elijas participar de forma anónima.',
        'Análisis y sistematización: Procesamos la información para identificar tendencias, temas comunes y elaborar reportes técnicos.',
        'Comunicación: Podemos enviarte notificaciones sobre el proceso participativo (si proporcionaste tu correo).',
        'Mejora del servicio: Utilizamos datos agregados para optimizar la plataforma.'
      ]
    },
    {
      icon: Shield,
      title: 'Protección de tus Datos',
      content: [
        'No compartimos tu información personal con terceros sin tu consentimiento.',
        'Implementamos medidas de seguridad técnicas y administrativas para proteger tus datos.',
        'El acceso a información personal está restringido al personal autorizado de SEGEPLAN.',
        'Tus datos se almacenan en servidores seguros con cifrado.'
      ]
    },
    {
      icon: UserCheck,
      title: 'Tus Derechos',
      content: [
        'Acceso: Puedes solicitar una copia de la información que tenemos sobre ti.',
        'Rectificación: Puedes pedir correcciones si tu información es inexacta.',
        'Eliminación: Puedes solicitar la eliminación de tus datos personales (los comentarios públicos pueden permanecer en forma anonimizada).',
        'Oposición: Puedes oponerte al procesamiento de tus datos para ciertos fines.',
        'Para ejercer estos derechos, contacta a: privacidad@segeplan.gob.gt'
      ]
    },
    {
      icon: Eye,
      title: 'Transparencia y Publicidad',
      content: [
        'Los comentarios y propuestas son públicos por naturaleza, ya que forman parte de un proceso participativo.',
        'Puedes elegir participar de forma anónima (sin proporcionar nombre ni correo).',
        'Los reportes y análisis derivados de tu participación serán públicos, pero en forma agregada y anonimizada.'
      ]
    },
    {
      icon: AlertCircle,
      title: 'Consentimiento',
      content: [
        'Al enviar tu retroalimentación a través de esta plataforma, consientes el procesamiento de tu información conforme a esta política.',
        'Si proporcionas datos personales, lo haces de manera voluntaria.',
        'Puedes retirar tu consentimiento en cualquier momento contactándonos.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Aviso de Privacidad
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SEGEPLAN se compromete a proteger tu privacidad y manejar tus datos personales
              de manera responsable y transparente.
            </p>
            <div className="flex justify-center my-6">
              <img src={Linea} alt="Separador" />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Responsable del Tratamiento de Datos
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>Secretaría de Planificación y Programación de la Presidencia (SEGEPLAN)</strong>
            </p>
            <p className="text-gray-600 text-sm">
              9a. calle 10-44 Zona 1, Guatemala<br />
              PBX: 2326-0000<br />
              Correo: privacidad@segeplan.gob.gt<br />
              Sitio web: www.segeplan.gob.gt
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-6">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <AnimatedSection key={index} delay={300 + index * 100}>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-700 leading-relaxed flex items-start">
                            <span className="text-blue-600 mr-2 flex-shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection delay={900}>
          <div className="mt-8 bg-gray-100 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Cambios a esta Política
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento.
              Los cambios serán publicados en esta página con la fecha de última actualización.
              Te recomendamos revisar esta política periódicamente.
            </p>
            <p className="text-sm text-gray-600 mt-4">
              <strong>Última actualización:</strong> Febrero 2026
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={1000}>
          <div className="mt-8 bg-blue-600 text-white rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-3">
              ¿Tienes Preguntas?
            </h3>
            <p className="mb-4">
              Si tienes dudas sobre cómo manejamos tu información o deseas ejercer tus derechos,
              contáctanos.
            </p>
            <a
              href="mailto:privacidad@segeplan.gob.gt"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contactar a Privacidad
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
