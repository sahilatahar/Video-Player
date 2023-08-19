import { createContext, useState } from "react";
import PropTypes from 'prop-types';
import { videosURLs } from "../Data/data";

const Context = createContext();

export default function ContextProvider({ children }) {

    const [videoList, setVideoList] = useState(videosURLs);
    const [currentVideoSrc, setCurrentVideoSrc] = useState(videoList[0]);

    return (
        <Context.Provider value={{ videoList, setVideoList, currentVideoSrc, setCurrentVideoSrc }}>
            {children}
        </Context.Provider>
    );
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { Context }