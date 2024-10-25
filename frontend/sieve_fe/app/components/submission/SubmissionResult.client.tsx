import { ClientOnly } from "remix-utils/client-only";
import Feedback, { Conversation } from "~/types/Feedback";
import AudioPlayer from "../VoiceNotePlayer.client";
import { AnswerButtonSize, ButtonTextStyle } from "~/styles/ButtonStyles";
import { ServiceUri } from "~/constants";
import {
  FeedbackQuestionStyle,
  FeedbackAnswerStyle,
  FeedbackSwitchStyle,
  FeedbackHeaderStyle,
} from "~/styles/TextStyles";
import Strength from "./Strength";

const SubmissionResult = ({
  feedback,
  handleChangeStyle,
}: {
  feedback: Feedback;
}) => {
  return (
    <div className="flex flex-col items-start gap-4 w-full h-auto p-8 pt-4">
      <div
        style={FeedbackHeaderStyle}
        className="flex flex-row items-center h-16 text-2xl"
      >
        <p>Anonimito Incognito</p>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 justify-start items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                stroke="#A9B3BE"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M22 6L12 13L2 6"
                stroke="#A9B3BE"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <div>{feedback.email}</div>
          </div>
          <div className="flex flex-row gap-4 justify-start items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#A9B3BE"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 6V12L16 14"
                stroke="#A9B3BE"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <div>3 minutes</div>
          </div>
          <div className="flex flex-row gap-4 justify-start items-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                stroke="#A9B3BE"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16 2V6"
                stroke="#A9B3BE"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 2V6"
                stroke="#A9B3BE"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3 10H21"
                stroke="#A9B3BE"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <div>30 Feb</div>
          </div>
        </div>
        <div className="flex flex-col gap-4 justify-start">
          <Strength text="Accurate Answers" />
          <Strength text="In-Depth" />
          <Strength text="Logically Structured" />
          <Strength text="Articulate Speech" />
        </div>
        <div>
          <div>
            <p>{feedback.feedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResult;
