import './index.sass'
import ReactDOM from 'react-dom/client'
import App from './App.js'

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
}

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
}
const canvasContainer =
  document.querySelector('#canvas') as FullscreenElement;


const root = ReactDOM.createRoot(
  canvasContainer
);


const fullscreenDocument =
  document as FullscreenDocument;

const toggleFullscreen = () => {

  const fullscreenElement =
    document.fullscreenElement ||
    fullscreenDocument.webkitFullscreenElement;


  if (!fullscreenElement) {

    if (canvasContainer.requestFullscreen) {

      canvasContainer.requestFullscreen();

    } else if (canvasContainer.webkitRequestFullscreen) {

      canvasContainer.webkitRequestFullscreen();

    }

  } else {

    if (document.exitFullscreen) {

      document.exitFullscreen();

    } else if (fullscreenDocument.webkitExitFullscreen) {

      fullscreenDocument.webkitExitFullscreen();

    }

  }

};

window.addEventListener(
  "dblclick",
  toggleFullscreen
);

root.render(
  <App/>
)
