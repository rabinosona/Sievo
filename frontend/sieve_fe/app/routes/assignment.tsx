import type { MetaFunction } from "@remix-run/node";
import { useContext, useDebugValue, useEffect, useState } from "react";
import { useChat } from "~/ChatContext";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { Button } from "@mantine/core";
import React, { lazy, Suspense } from "react";
import { ClientOnly } from "remix-utils/client-only";

import { useNavigate } from "@remix-run/react";
import RecorderProgress from "~/components/RecorderProgress.client";
import { ButtonSize, QuestionButtonStyle } from "~/styles/ButtonStyles";
import { addAudioElement, RecorderState } from "~/functions/RecordingFunctions";
import useMediaRecorder from "@wmik/use-media-recorder";
import { WelcomeTextStyle } from "~/styles/TextStyles";
import OngoingInterview from "~/components/interview/OngoingInterview";
import WelcomeInterview from "~/components/interview/WelcomeInterview";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const questions = ["q1"];

  const { chatId } = useChat();
  const [fileContent, setFileContent] = useState<Blob>();
  const recorderControls = useVoiceVisualizer();
  const [isMounted, setIsMounted] = useState(false);
  const [navigateToSubmission, setNavigateToSubmission] = useState(false);

  const navigate = useNavigate();

  const [questionHeard, setQuestionHeard] = useState<Map<string, boolean>>(
    new Map<string, boolean>()
  );
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  const [recordingState, setRecordingState] = useState<RecorderState>(
    RecorderState.Recorded
  );

  let { mediaBlob, stopRecording, startRecording } = useMediaRecorder({
    recordScreen: false,
    blobOptions: { type: "audio/mpeg" },
    mediaStreamConstraints: { audio: true, video: false },
  });

  const handleQuestion = () => {
    if (questionHeard.get(questions[currentQuestion])) {
      handleRecordSwitch();
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuestionHeard(
        new Map<string, boolean>(
          questionHeard.set(questions[currentQuestion], true)
        )
      );
      handleRecordSwitch();
      recorderControls.togglePauseResume();
    }
  };

  const handleRecordSwitch = () => {
    if (recordingState != RecorderState.Recording) {
      setRecordingState(RecorderState.Recording);
      handleStart();
    } else {
      setRecordingState(RecorderState.Recorded);
      handleStop();
    }
  };

  const getQuestion = () => {
    if (questionHeard.get(questions[currentQuestion])) {
      if (currentQuestion + 1 === questions.length) {
        return "Submit Result";
      }
      return "Next Question";
    } else {
      return "Hear Question";
    }
  };

  const fetchQuestion = (q: string) => {
    fetch(`/questions/${q}.mp3`)
      .then((response) => response.blob()) // or response.blob() if you want the blob
      .then((data) => {
        setFileContent(fileContent);
        recorderControls.setPreloadedAudioBlob(data);
      })
      .catch((error) => {
        console.error("Error loading file:", error);
        return error;
      });
  };

  const handleStart = () => {
    startRecording();
  };

  const handleStop = async () => {
    stopRecording();
  };

  useEffect(() => {
    fetchQuestion(questions[currentQuestion]);
  }, [currentQuestion]);

  useEffect(() => {
    fetchQuestion(questions[currentQuestion]);
    setIsMounted(true);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const processMedia = async () => {
      if (mediaBlob) {
        setIsLoading(true);
        await addAudioElement(mediaBlob, chatId); // Await if this function is async
        setIsLoading(false);
        if (currentQuestion == questions.length) {
          setNavigateToSubmission(true);
        }
        console.log(chatId);
      }
    };

    processMedia();
  }, [mediaBlob, chatId]);

  useEffect(() => {
    console.log(isLoading, navigateToSubmission, currentQuestion);
    if (
      !isLoading &&
      navigateToSubmission &&
      currentQuestion == questions.length
    ) {
      navigate("/submission");
    }
  }, [currentQuestion, isLoading, navigateToSubmission]);

  if (isMounted) {
    return (
      <OngoingInterview
        recorderControls={recorderControls}
        currentQuestion={currentQuestion}
        questions={questions}
        questionHeard={questionHeard}
        getQuestion={getQuestion}
        handleQuestion={handleQuestion}
        disabled={isLoading}
      />
    );
  }
}
// recorderControls.togglePauseResume();
