import Redes1 from '../assets/footer/REDES-01.png';
import Redes2 from '../assets/footer/REDES-02.png';
import Redes3 from '../assets/footer/REDES-03.png';
import Redes4 from '../assets/footer/REDES-04.png';

const socialLinks = [
  { name: 'Facebook',  url: 'https://www.facebook.com/SegeplanGT/',                      icon: Redes1 },
  { name: 'Twitter',   url: 'https://x.com/segeplan',                                    icon: Redes2 },
  { name: 'Instagram', url: 'https://www.instagram.com/segeplan',                        icon: Redes3 },
  { name: 'YouTube',   url: 'https://www.youtube.com/channel/UC6_LyaH6aAYzDydSezE5LDw', icon: Redes4 },
];

const SocialSidebar = () => (
  <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1 hidden lg:flex">
    {socialLinks.map(s => (
      <a
        key={s.name}
        href={s.url}
        target="_blank"
        rel="noopener noreferrer"
        title={s.name}
        className="
          group flex items-center justify-center
          w-10 h-10
          bg-brand-900/80 hover:bg-brand-700
          backdrop-blur-sm
          transition-all duration-200
          hover:w-12 hover:h-12
          first:rounded-tl-lg last:rounded-bl-lg
        "
      >
        <img
          src={s.icon}
          alt={s.name}
          className="h-5 w-5 opacity-80 group-hover:opacity-100 transition-opacity"
        />
      </a>
    ))}
  </div>
);

export default SocialSidebar;
