import { BeatLoader } from "react-spinners";

import ClientMessageBubble from "./client-message-bubble";
import ServerMessageBubble from "./server-message-bubble";
import { MessageTypes } from "../../lib/constants";

function ChatMessages({
  title,
  user,
  messages,
  showTyping,
  leaveHandler,
}: {
  title?: string;
  user: UserCore;
  messages: (ClientMsg | ServerMsg)[];
  showTyping: boolean;
  leaveHandler: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 h-96 w-full">
      <div className="flex justify-between h-9 pl-3 pr-1 py-1 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg shadow-lg">
        <h1
          className={`text-xl ${
            title ? "text-zinc-900 dark:text-zinc-300" : "text-zinc-500"
          }`}
        >
          {title ? title : "--nothing selected--"}
        </h1>
        {title && (
          <button
            onClick={leaveHandler}
            className="px-2 transition-colors text-zinc-700 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 bg-transparent hover:bg-red-500/60 uppercase rounded-lg"
          >
            leave
          </button>
        )}
      </div>
      <div className="flex-grow bg-zinc-200 dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
        <div
          id="chat-window"
          className="h-full w-full pr-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/25 hover:scrollbar-thumb-black/30 dark:scrollbar-thumb-white/25 dark:hover:scrollbar-thumb-white/30"
        >
          {messages && (
            <ul>
              {messages.map((message) => {
                if (message.type === MessageTypes.SERVER) {
                  const serverMessage = message as ServerMsg;
                  return (
                    <li key={serverMessage.id}>
                      <ServerMessageBubble message={serverMessage} />
                    </li>
                  );
                }
                if (message.type === MessageTypes.CLIENT) {
                  const clientMessage = message as ClientMsg;
                  return (
                    <li key={message.id}>
                      <ClientMessageBubble
                        message={clientMessage}
                        isOwn={user.id === clientMessage.author.id}
                      />
                    </li>
                  );
                }
              })}
            </ul>
          )}
          <div className="h-6 mb-3 mr-5">
            <BeatLoader
              loading={showTyping}
              className="text-right"
              color="rgb(168 85 247)"
              size={5}
              speedMultiplier={0.8}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessages;
