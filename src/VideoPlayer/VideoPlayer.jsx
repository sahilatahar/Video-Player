import { formatTime } from '../utils/formatTime';
import './VideoPlayer.scss';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../Context/Context';

function VideoPlayer() {

    const { videoList, currentVideoSrc, setCurrentVideoSrc } = useContext(Context);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVolume, setCurrentVolume] = useState(1);
    const [isMute, setIsMute] = useState(false);
    const videoRef = useRef(null);
    const videoRangeRef = useRef(null);
    const volumeRangeRef = useRef(null);
    let currentVideoIndex = useRef(0);

    const [duration, setDuration] = useState([0, 0]);
    const [currentTime, setCurrentTime] = useState([0, 0]);
    const [durationSec, setDurationSec] = useState(0);
    const [currentSec, setCurrentTimeSec] = useState(0);

    const handlePlayPause = () => {
        isPlaying ? pause() : play();
    }

    const play = async () => {
        setIsPlaying(true);
        try {
            await videoRef.current.play();
        } catch (error) {
            console.log("Can't play video");
            setIsPlaying(false);
        }
    }

    const pause = () => {
        setIsPlaying(false);
        videoRef.current.pause();
    }

    const stop = () => {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setCurrentTimeSec(0);
        setIsPlaying(false);
    }

    const handleNext = useCallback(() => {
        currentVideoIndex.current++;
        if (currentVideoIndex.current >= videoList.length) {
            currentVideoIndex.current = 0;
        }
        setCurrentVideoSrc(videoList[currentVideoIndex.current]);
        setCurrentTimeSec(0);
    }, [videoList, setCurrentVideoSrc]);

    const handlePrev = () => {
        currentVideoIndex.current--;
        if (currentVideoIndex.current < 0) {
            currentVideoIndex.current = videoList.length - 1;
        }
        setCurrentTimeSec(0);
        setCurrentVideoSrc(videoList[currentVideoIndex.current]);
    }

    const handleVideoRange = () => {
        videoRef.current.currentTime = videoRangeRef.current.value;
        setCurrentTimeSec(videoRangeRef.current.value);
    }

    const handleFullScreen = () => {
        const elem = videoRef.current;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }

    const handleVolumeRange = () => {
        let volume = volumeRangeRef.current.value;
        videoRef.current.volume = volume;
        setCurrentVolume(volume);
        if (volume == 0) {
            setIsMute(true);
        } else {
            setIsMute(false);
        }
    }

    const handleMute = () => {
        if (isMute) {
            videoRef.current.volume = currentVolume;
            setIsMute(false);
        } else {
            videoRef.current.volume = 0;
            setIsMute(true);
        }
    }

    useEffect(() => {
        let interval;

        if (isPlaying) {
            interval = setInterval(() => {
                const { min, sec } = formatTime(videoRef.current.currentTime);
                setCurrentTimeSec(videoRef.current.currentTime);
                setCurrentTime([min, sec]);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);


    useEffect(() => {
        currentVideoIndex.current = videoList?.findIndex(item => item === currentVideoSrc) || 0;
        videoRef.current.addEventListener('loadeddata', () => {
            setDurationSec(videoRef.current.duration);
            const { min, sec } = formatTime(videoRef.current.duration);
            setDuration([min, sec]);
            setIsPlaying(false);
            play();
        }, false);
        videoRef.current.addEventListener('ended', handleNext)
    }, [currentVideoSrc, handleNext, videoList]);

    return (
        <div className="VideoPlayer">
            <video ref={videoRef} src={currentVideoSrc} onClick={handlePlayPause}>
            </video>
            <div className="VideoPlayer__controls">
                <div className="control-group control-group-btn">
                    <button className="control-button pre" onClick={handlePrev}>
                        <i className="ri-skip-back-fill icon"></i>
                    </button>
                    <button className="control-button play-pause" onClick={handlePlayPause}>
                        <i className={`ri-${isPlaying ? 'pause' : 'play'}-fill icon`}></i>
                    </button>
                    <button className="control-button next" onClick={handleNext}>
                        <i className="ri-skip-forward-fill icon"></i>
                    </button>
                    <button className="control-button stop" onClick={stop}>
                        <i className="ri-stop-fill icon"></i>
                    </button>
                </div>
                <div className="control-group control-group-slider">
                    <input type="range" className="range-input" ref={videoRangeRef} onChange={handleVideoRange} max={durationSec} value={currentSec} min={0} />
                    <span className="time">{currentTime[0]}:{currentTime[1]} / {duration[0]}:{duration[1]}</span>
                </div>
                <div className="control-group control-group-volume">
                    <button className="control-button volume" onClick={handleMute}>
                        <i className={`ri-volume-${isMute ? 'mute' : 'up'}-fill`}></i>
                    </button>
                    <input type="range" className='range-input' ref={volumeRangeRef} max={1} min={0} value={currentVolume} onChange={handleVolumeRange} step={0.1} />
                    <button className="control-button full-screen" onClick={handleFullScreen}>
                        <i className="ri-fullscreen-line"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer
