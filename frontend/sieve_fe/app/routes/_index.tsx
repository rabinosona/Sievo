import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { Button, TextInput } from "@mantine/core";
import { createContext, useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useChat } from "~/ChatContext";
import { ClientOnly } from "remix-utils/client-only";

import SubmissionTranscript from "~/components/submission/SubmissionTranscript.client";
import WelcomeInterview from "~/components/interview/WelcomeInterview";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const ChatContext = createContext("doesn'tgetset");

export default function Index() {
  const navigate = useNavigate();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [email, setEmail] = useState<string>('');

  const { setChatId } = useChat();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values: { email: string }) => {
    try {
      console.log('submit')
      const response = await fetch("http://localhost:8000/api/sessions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        console.log("ERROR", response.json());
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setChatId(data.chat_id); // Update global state with chat_id from the response
      if (permissionGranted)
      navigate("assignment");
    } catch (error) {
      console.error("There was an error with the POST request:", error);
    }
  };

  const handleRequestMicrophonePermission = async () => {
    let permission = false;

    await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        permission = stream.active;
        // Stop the stream if permission is granted to release the microphone
        console.log('access g')
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((err) => {
        console.warn("Microphone access denied:", err);
        permission = false;
      });

    setPermissionGranted(permission);
  };

  useEffect(() => {
    if (permissionGranted)
    {
      const f = async () => await handleSubmit({ email: email })

      f();

      navigate('/assignment')
    }
  }, [permissionGranted, email])

  return (
    <WelcomeInterview
      handleRequestMicrophonePermission={handleRequestMicrophonePermission}
      handleSubmit={setEmail}
    ></WelcomeInterview>
  );
}
