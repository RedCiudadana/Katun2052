import { Link } from 'react-router-dom';
import { Phone, ExternalLink, MapPin } from 'lucide-react';
import Redes1 from '../assets/footer/REDES-01.png';
import Redes2 from '../assets/footer/REDES-02.png';
import Redes3 from '../assets/footer/REDES-03.png';
import Redes4 from '../assets/footer/REDES-04.png';
import Linea from '../assets/footer/LINEA.png';
import SegeplanLogo from '/images/segeplan-logo.jpg';

const social = [
  { name: 'Facebook',  url: 'https://www.facebook.com/SegeplanGT/',                         icon: Redes1 },
  { name: 'Twitter',   url: 'https://x.com/segeplan',                                       icon: Redes2 },
  { name: 'Instagram', url: 'https://www.instagram.com/segeplan',                           icon: Redes3 },
  { name: 'YouTube',   url: 'https://www.youtube.com/channel/UC6_LyaH6aAYzDydSezE5LDw',    icon: Redes4 },
];

const quickLinks = [
  { label: 'Inicio',      to: '/' },
  { label: 'Documentos',  to: '/documentos' },
  { label: 'Cronograma',  to: '/calendario' },
  { label: 'Encuesta',    to: '/encuesta' },
  { label: 'Privacidad',  to: '/privacidad' },
  { label: 'Admin',       to: '/admin' },
];

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300">
    {/* Main content */}
    <div className="container-wide py-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={SegeplanLogo} alt="SEGEPLAN" className="h-12 w-auto rounded-lg" />
            <div>
              <div className="text-white font-bold text-sm">SEGEPLAN</div>
              <div className="text-slate-400 text-xs">Secretaría de Planificación</div>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Plataforma de participación ciudadana para la actualización del
            Plan Nacional de Desarrollo K'atun: Nuestra Guatemala 2032.
          </p>
          <div className="pt-2">
            <p className="text-xs text-slate-500 mb-2">Implementado con la Asistencia Técnica de:</p>
            <a
              href="https://www.redciudadana.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-300 hover:text-brand-200 underline underline-offset-2 transition-colors"
            >
              Asociación Civil Red Ciudadana
            </a>
          </div>
        </div>

        {/* Quick links + Contact */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                PBX: 2326-0000
              </li>
              <li className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                <a
                  href="https://www.segeplan.gob.gt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-300 hover:text-brand-200 transition-colors"
                >
                  segeplan.gob.gt
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-500" />
                9a. calle 10-44 Zona 1, Guatemala
              </li>
            </ul>
          </div>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
            Síguenos
          </h4>
          <div className="flex gap-3">
            {social.map(s => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                title={s.name}
                className="opacity-70 hover:opacity-100 transition-all duration-200 hover:scale-110 transform"
              >
                <img src={s.icon} alt={s.name} className="h-10 w-10" />
              </a>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500 leading-relaxed">
            Mantente informado sobre el proceso de actualización del Plan
            Nacional de Desarrollo.
          </p>
        </div>
      </div>
    </div>

    {/* Divider */}
    <img src={Linea} alt="" className="linea" />

    {/* Bottom bar */}
    <div className="container-wide py-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© 2025 SEGEPLAN — Secretaría de Planificación y Programación de la Presidencia</p>
        <div className="flex items-center gap-4">
          <Link to="/privacidad" className="hover:text-slate-300 transition-colors">
            Aviso de Privacidad
          </Link>
          <span>·</span>
          <a
            href="https://www.segeplan.gob.gt"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            Sitio Oficial
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
