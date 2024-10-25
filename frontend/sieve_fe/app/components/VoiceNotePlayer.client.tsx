import React, { useState, useRef, useEffect } from "react";
import { NumberToOrdinal } from "~/functions/NumberConversion";
import ReactAudioPlayer from 'react-audio-player';

const AudioPlayer = ({ audioSrc, index }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // When the component mounts on the client, set the flag to true
    setIsClient(true);
  }, []);

  if (!isClient) {
    // SSR: Return a static placeholder or fallback
    return <div>Loading Audio Player...</div>;
  }

  return (
    <div className="flex flex-row items-center w-full h-full">
      <div className="flex flex-row gap-4 items-center h-full justify-start w-full">
        <p className="w-1/3">Play {NumberToOrdinal(index / 2 + 1)} answer</p>
        <ReactAudioPlayer className="w-full" src={audioSrc} autoPlay={false} controls />
      </div>
    </div>
  );
};

export default AudioPlayer;
