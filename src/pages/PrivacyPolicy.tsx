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
    <div className="min-h-screen bg-slate-50">
      <section className="page-hero">
        <div className="container-wide">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-3">
              <Shield className="h-6 w-6 text-brand-200" />
              <span className="badge bg-white/15 text-white/90 text-xs uppercase tracking-wider">
                Protección de datos
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Aviso de Privacidad</h1>
            <p className="text-lg text-brand-100 max-w-2xl">
              SEGEPLAN se compromete a proteger tu privacidad y manejar tus datos
              de manera responsable y transparente.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="container-narrow py-10">
        <AnimatedSection>
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 mb-8">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Responsable del Tratamiento de Datos
            </h2>
            <p className="text-sm font-semibold text-slate-800 mb-1">
              Secretaría de Planificación y Programación de la Presidencia (SEGEPLAN)
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              9a. calle 10-44 Zona 1, Guatemala · PBX: 2326-0000<br />
              privacidad@segeplan.gob.gt · www.segeplan.gob.gt
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-4">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <AnimatedSection key={i} delay={i * 80}>
                <div className="card bg-white p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-brand-100 text-brand-700 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 mb-3">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.content.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                            <span className="text-brand-500 mt-0.5 shrink-0">•</span>
                            {item}
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

        <AnimatedSection delay={700}>
          <div className="mt-6 card-flat border border-slate-200 bg-slate-100 p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Cambios a esta Política</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nos reservamos el derecho de actualizar esta política en cualquier momento.
              Los cambios serán publicados con la fecha de última actualización.
            </p>
            <p className="text-xs text-slate-400 mt-3 font-medium">Última actualización: Febrero 2026</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={800}>
          <div className="mt-6 bg-gradient-brand rounded-2xl p-7 text-white text-center">
            <h3 className="text-xl font-bold mb-2">¿Tienes Preguntas?</h3>
            <p className="text-white/75 text-sm mb-5">
              Si tienes dudas sobre cómo manejamos tu información, contáctanos.
            </p>
            <a
              href="mailto:privacidad@segeplan.gob.gt"
              className="btn bg-white text-brand-800 px-6 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-colors"
            >
              privacidad@segeplan.gob.gt
            </a>
          </div>
        </AnimatedSection>

        <div className="mt-10">
          <img src={Linea} alt="" className="linea" />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
