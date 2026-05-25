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
    </div>
  </div>
);

export default TopBar;
