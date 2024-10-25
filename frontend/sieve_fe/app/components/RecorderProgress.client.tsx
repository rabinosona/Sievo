"use client";

import { useEffect, useState } from "react";
import { ServiceUri } from "../constants";
import useMediaRecorder from "@wmik/use-media-recorder";
import { Button } from "@mantine/core";
import { useLottie } from "lottie-react";
import {
  ButtonFontStyle,
  ButtonSize,
  ButtonTextStyle,
} from "~/styles/ButtonStyles";
import OngoingRecordAnimation from "../recording.json";

const RecorderProgress = () => {
  const style = {
    height: 30,
    width: 30,
  };

  const options = {
    animationData: OngoingRecordAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, style);

  const RecordButtonStyle = {
    backgroundColor: "#f2f2f7",
    color: "#0D0C26",
    justifyContent: "flex-start",
    display: "flex",
  };

  return (
    <Button
      style={{
        ...RecordButtonStyle,
        ...ButtonFontStyle,
      }}
      className={`${ButtonSize} ${ButtonTextStyle} flex items-center`}
    >
      <div className="flex flex-row items-center">
        <div className="flex flex-row gap-4 items-center justify-start">
          <div>{View}</div>
          <div>Recording...</div>
        </div>
      </div>
    </Button>
  );
};

export default RecorderProgress;
// className="w-4 h-full mr-2 align-middle"
