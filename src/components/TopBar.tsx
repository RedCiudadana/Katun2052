import Redes1 from '../assets/footer/REDES-01.png';
import Redes2 from '../assets/footer/REDES-02.png';
import Redes3 from '../assets/footer/REDES-03.png';
import Redes4 from '../assets/footer/REDES-04.png';

const socialLinks = [
  { name: 'Facebook',  url: 'https://www.facebook.com/SegeplanGT/',                         icon: Redes1 },
  { name: 'Twitter',   url: 'https://x.com/segeplan',                                       icon: Redes2 },
  { name: 'Instagram', url: 'https://www.instagram.com/segeplan',                           icon: Redes3 },
  { name: 'YouTube',   url: 'https://www.youtube.com/channel/UC6_LyaH6aAYzDydSezE5LDw',    icon: Redes4 },
];

const TopBar = () => (
  <div
    id="topbar"
    className="bg-brand-900 text-white text-xs"
    style={{ height: 'var(--topbar-h)' }}
  >
    <div className="container-wide h-full flex items-center justify-between">
      <span className="text-brand-200 font-medium tracking-wide hidden sm:block">
        K'atun: Nuestra Guatemala 2032 &nbsp;|&nbsp; SEGEPLAN
      </span>
      <span className="text-brand-200 font-medium tracking-wide sm:hidden">
        SEGEPLAN
      </span>

      <div className="flex items-center gap-3">
        <span className="text-brand-300 hidden sm:block">Síguenos:</span>
        <div className="flex items-center gap-1.5">
          {socialLinks.map(s => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={s.name}
              className="opacity-80 hover:opacity-100 transition-opacity duration-200 hover:scale-110 transform"
            >
              <img src={s.icon} alt={s.name} className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default TopBar;
