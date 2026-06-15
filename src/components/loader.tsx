import LoaderGif from '../assets/loader.gif';
import './loader.css';

const Loader = () => {
  return (
    <div id="preloader-active">
      <div className="preloader d-flex align-items-center justify-content-center">
        <div className="preloader-inner position-relative">
          <div className="text-center">
            <img
              src={LoaderGif}
              style={{ width: "50%", height: "auto", margin: "auto" }}
              alt="Loading..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
