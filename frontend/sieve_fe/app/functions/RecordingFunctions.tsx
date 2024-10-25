import { ServiceUri } from "~/constants";

export const addAudioElement = async (blob: Blob, chatId: string) => {
    const formData = new FormData();
    formData.append("file", blob, "audio.webm"); // Append Blob as 'file'
    formData.append("chat_id", chatId);

    await fetch(ServiceUri + "api/responses/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  export enum RecorderState {
    Recording,
    Recorded,
  }