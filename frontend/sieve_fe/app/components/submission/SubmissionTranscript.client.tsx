import { ClientOnly } from "remix-utils/client-only";
import Feedback, { Conversation } from "~/types/Feedback";
import AudioPlayer from "../VoiceNotePlayer.client";
import { AnswerButtonSize, ButtonTextStyle } from "~/styles/ButtonStyles";
import { ServiceUri } from "~/constants";
import {
  FeedbackQuestionStyle,
  FeedbackAnswerStyle,
} from "~/styles/TextStyles";

const SubmissionTranscript = ({
  conversation,
}: {
  conversation: Conversation[];
}) => {
  return (
    <div className="flex flex-col items-start gap-6 w-full h-full p-6 pt-4">
      {conversation &&
        conversation.map((item: Conversation, i) => {
          if (i + 1 < conversation.length) {
            if (i % 2 == 0) {
              const q = item.content;
              const a = conversation[i + 1].content;

              return (
                <div key={i} className="flex flex-col h-auto w-full gap-4">
                  <div
                    className={`${AnswerButtonSize} ${ButtonTextStyle}`}
                  >
                    {conversation[i + 1].audio_url && (
                      <ClientOnly>
                        {() => (
                          <AudioPlayer
                            index={i}
                            audioSrc={
                              ServiceUri + conversation[i + 1].audio_url
                            }
                          />
                        )}
                      </ClientOnly>
                    )}
                  </div>
                  <p style={FeedbackQuestionStyle}>
                    {`${i / 2 + 1}.`} {q}
                  </p>
                  <p style={FeedbackAnswerStyle}>{a}</p>
                </div>
              );
            }
          }
        })}
    </div>
  );
};

export default SubmissionTranscript;
