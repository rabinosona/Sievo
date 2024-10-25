export type Conversation = {
  content: string;
  role: "assistant" | "user";
  audio_url: string | null;
};

export type Feedback = {
  email: string;
  feedback: string;
  conversation: Conversation[];
};

export enum FeedbackStatus {
  Review,
  Transcript,
}

export default Feedback;
