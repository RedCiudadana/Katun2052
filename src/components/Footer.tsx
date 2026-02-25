import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ExternalLink, Facebook, Twitter, Youtube } from 'lucide-react';
import Redes1 from '../assets/footer/REDES-01.png';
import Redes2 from '../assets/footer/REDES-02.png';
import Redes3 from '../assets/footer/REDES-03.png';
import Redes4 from '../assets/footer/REDES-04.png';
import Linea from '../assets/footer/LINEA.png';
import SegeplanLogo from '/images/segeplan-logo.jpg';

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Logo */}
            <div>
              <img src={SegeplanLogo} alt="SEGEPLAN Logo" className="h-16 w-auto"/>
              <h3 className="text-lg font-semibold mt-4 mb-2">K'atun 2052</h3>
              <p className="text-sm text-gray-300">
                Plan Nacional de Desarrollo: Nuestra Guatemala 2052
              </p>
              <p className='mt-4 text-xs text-gray-400'>Plataforma desarrollada con tecnología de:</p>
              <img className="h-8 w-auto filter-white mt-2" src="https://www.redciudadana.org/assets/img/red/LOGO-RED_NEGRO.png" alt="Red Ciudadana Logo"/>
            </div>

            {/* Información de Contacto */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto SEGEPLAN</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-white" />
                  <span className="text-sm">PBX: 2326-0000</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-white" />
                  <a href="https://www.segeplan.gob.gt" className="text-sm hover:text-blue-300 transition-colors">
                    www.segeplan.gob.gt
                  </a>
                </div>
                <div className="text-sm text-white">
                  9a. calle 10-44 Zona 1, Guatemala
                </div>
              </div>
            </div>

            {/* Enlaces Útiles */}
            {/* <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Útiles</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://www.oj.gob.gt" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-blue-300 transition-colors flex items-center space-x-1">
                    <span>Organismo Judicial</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="https://www.guatemala.gob.gt" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-blue-300 transition-colors flex items-center space-x-1">
                    <span>Organismo Ejecutivo</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a href="https://www.congreso.gob.gt" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-blue-300 transition-colors flex items-center space-x-1">
                    <span>Organismo Legislativo</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div> */}

            {/* Redes Sociales */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/segeplan/" target='_blank' className="text-white hover:text-blue-400 transition-colors">
                  <img src={Redes1} className="h-12 w-12" />
                </a>
                <a href="https://x.com/segeplan" target='_blank' className="text-white hover:text-blue-400 transition-colors">
                  <img src={Redes2} className="h-12 w-12" />
                </a>
                <a href="https://www.instagram.com/segeplan/" target='_blank' className="text-white hover:text-red-400 transition-colors">
                  <img src={Redes3} className="h-12 w-12" />
                </a>
                <a href="https://www.youtube.com/@segeplan" target='_blank' className="text-white hover:text-red-400 transition-colors">
                  <img src={Redes4} className="h-12 w-12" />
                </a>
              </div>
            </div>
          </div>

            <div className="w-full my-8">
            <img src={Linea} alt="Separador" className="h-5 w-full" />
            </div>

          <div className="mt-4 pt-4 text-center">
            <p className="text-sm text-white">
              2025 SEGEPLAN - Secretaría de Planificación y Programación de la Presidencia
            </p>
            <p className="text-xs text-white mt-2">
              Plataforma de Participación Ciudadana K'atun 2052
            </p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <Link to="/privacidad" className="text-xs text-blue-300 hover:text-blue-200 underline">
                Aviso de Privacidad
              </Link>
              <span className="text-gray-500">•</span>
              <a href="https://www.segeplan.gob.gt" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-300 hover:text-blue-200 underline">
                Sitio Oficial SEGEPLAN
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Desarrollado con Participa! de <a href="https://www.redciudadana.org/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">Red Ciudadana</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;