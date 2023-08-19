import VideoPlayer from "./VideoPlayer/VideoPlayer"
import Popup from "./components/Popup/Popup";
import './App.scss';
import { useContext, useState } from "react";
import { Context } from './Context/Context';

function App() {

  const [isPopup, setIsPopup] = useState(false);
  const { setVideoList, setCurrentVideoSrc } = useContext(Context);

  return (
    <div className="App">
      {!isPopup && <button className="popup-btn" onClick={() => setIsPopup(true)}><i className="ri-links-line"></i></button>}

      {isPopup && <Popup {...{ setVideoList, setCurrentVideoSrc, setIsPopup }} />}
      <VideoPlayer />
    </div>
  )
}

export default App