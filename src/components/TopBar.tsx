// TopBar is a presentational component, no React import required with the new JSX transform
import Redes1 from '../assets/footer/REDES-01.png';
import Redes2 from '../assets/footer/REDES-02.png';
import Redes3 from '../assets/footer/REDES-03.png';
import Redes4 from '../assets/footer/REDES-04.png';

const TopBar = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/MinfinGT/',
      icon: Redes1
    },
    {
      name: 'Twitter',
      url: 'https://x.com/MinFinGT',
      icon: Redes2
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/minfingt/',
      icon: Redes3
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/user/minfingt',
      icon: Redes4
    }
  ];

  return (
    <div id="topbar" className="bg-gray-900 text-white py-2 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left side - Organization info */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              Participa! Una herramienta de <a href='https://www.redciudadana.org/' className='hover' target="_blank">Red Ciudadana</a>
            </span>
          </div>

          {/* Right side - Social media */}
          <div className="flex items-center space-x-3">
            <span className="text-gray-300 hidden sm:inline">
              Síguenos:
            </span>
            <div className="flex items-center space-x-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  title={`Síguenos en ${social.name}`}
                >
                  <img 
                    src={social.icon} 
                    alt={social.name}
                    className="h-7 w-7"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;