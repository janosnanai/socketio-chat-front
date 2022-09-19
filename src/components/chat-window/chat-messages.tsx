import { useAtom } from "jotai";
import { useEffect } from "react";

import MessageBubble from "./message-bubble";
import {
  messagesGetterAtom,
  thisUserGetterAtom,
  usersTypingGetterAtom,
} from "../../lib/atoms";
import { MessageTypes } from "../../lib/constants";

function ChatMessages() {
  const [messages] = useAtom(messagesGetterAtom);
  const [user] = useAtom(thisUserGetterAtom);
  const [showTyping] = useAtom(usersTypingGetterAtom);
  const chatWindow = document.getElementById("chat-window");

  useEffect(() => {
    if (!chatWindow) return;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  return (
    <div className="h-96 w-full rounded-lg shadow-lg overflow-hidden">
      <div
        id="chat-window"
        className="h-full w-full pr-1 overflow-y-auto bg-zinc-200 dark:bg-zinc-900 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/25 hover:scrollbar-thumb-black/30 dark:scrollbar-thumb-white/25 dark:hover:scrollbar-thumb-white/30"
      >
        <ul>
          {messages.map((message) => {
            if (message.type === MessageTypes.SERVER) {
              return (
                <li key={message.id}>
                  <p className="text-sm text-center text-zinc-500">
                    {(message as ServerMsg).content}
                  </p>
                </li>
              );
            }
            if (message.type === MessageTypes.CLIENT) {
              return (
                <li key={message.id}>
                  <MessageBubble
                    message={message as ClientMsg}
                    // @ts-ignore
                    isOwn={user.id === message.author.id}
                  />
                </li>
              );
            }
          })}
        </ul>
        <p className="h-6 w-full">
          {showTyping && "somebody is typing a message..."}
        </p>
      </div>
    </div>
  );
}

export default ChatMessages;
