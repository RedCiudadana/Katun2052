import React from 'react';
import { Mail, Phone, ExternalLink, Facebook, Twitter, Youtube } from 'lucide-react';
import Redes1 from '../assets/footer/REDES-01.png';
import Redes2 from '../assets/footer/REDES-02.png';
import Redes3 from '../assets/footer/REDES-03.png';
import Redes4 from '../assets/footer/REDES-04.png';
import Linea from '../assets/footer/LINEA.png';
import MinfinLogo from '../assets/minfin-logo.png';

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Logo */}
            <div>
              <img src={MinfinLogo} alt="MINFIN Logo" className="h-16 w-auto filter-white"/>
              <p className='mt-8'>Esta es una herramienta facilitada por:</p>
              <img className="h-8 w-auto filter-white " src="https://www.redciudadana.org/assets/img/red/LOGO-RED_NEGRO.png" alt="Red Ciudadana Logo"/>
            </div>

            {/* Información de Contacto */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-white" />
                  <span className="text-sm">PBX: 2374-3000</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-white" />
                  <a href="https://www.minfin.gob.gt" className="text-sm hover:text-blue-300 transition-colors">
                    www.minfin.gob.gt
                  </a>
                </div>
                <div className="text-sm text-white">
                  8a. Avenida 20-59 Zona 1, Centro Cívico, Guatemala - 01001
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
                <a href="https://www.facebook.com/MinfinGT/" target='_blank' className="text-white hover:text-blue-400 transition-colors">
                  <img src={Redes1} className="h-12 w-12" />
                </a>
                <a href="https://x.com/MinFinGT" target='_blank' className="text-white hover:text-blue-400 transition-colors">
                  <img src={Redes2} className="h-12 w-12" />
                </a>
                <a href="https://www.instagram.com/minfingt/" target='_blank' className="text-white hover:text-red-400 transition-colors">
                  <img src={Redes3} className="h-12 w-12" />
                </a>
                <a href="https://www.youtube.com/user/minfingt" target='_blank' className="text-white hover:text-red-400 transition-colors">
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
              2025 MINFIN - Ministerio de Finanzas Públicas de Guatemala.
            </p>
            <p className="text-xs text-white mt-2">
              Desarrollado con Participa! (software de código abierto) de <a href="https://www.redciudadana.org/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">Red Ciudadana</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;