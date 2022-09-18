import { useAtom } from "jotai";
import { useEffect } from "react";

import { messagesGetterAtom, usersTypingGetterAtom } from "../../lib/atoms";
import { MessageTypes } from "../../lib/constants";

function ChatMessages() {
  const [messages] = useAtom(messagesGetterAtom);
  const [showTyping] = useAtom(usersTypingGetterAtom);
  const chatWindow = document.getElementById("chat-window");

  useEffect(() => {
    if (!chatWindow) return;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  return (
    <div
      id="chat-window"
      className="h-96 w-full rounded-lg overflow-y-auto bg-zinc-300 dark:bg-zinc-900 shadow-lg"
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
                <p>{`${(message as ClientMsg).content} -- ${
                  (message as ClientMsg).author
                }`}</p>
              </li>
            );
          }
        })}
      </ul>
      <p className="h-6 w-full">
        {showTyping && "somebody is typing a message..."}
      </p>
    </div>
  );
}

export default ChatMessages;
