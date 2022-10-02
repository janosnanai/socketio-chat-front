import { EventTypes } from "../../lib/constants";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BeatLoader } from "react-spinners";

import MessageInput from "./message-input";
import ClientMessageBubble from "./client-message-bubble";
import ServerMessageBubble from "./server-message-bubble";
import { fetchPrivateChat } from "../../lib/api/fetch-chat";
import {
  targetUserGetterAtom,
  thisUserGetterAtom,
  socketAtom,
} from "../../lib/atoms";
import { MessageTypes } from "../../lib/constants";

function PrivateChatWindow() {
  const [socket] = useAtom(socketAtom);
  const [targetUser] = useAtom(targetUserGetterAtom);
  const [user] = useAtom(thisUserGetterAtom);
  const [messages, setMessages] = useState<(ClientMsg | ServerMsg)[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const { isLoading, isFetching, data, error } = useQuery(
    ["private-chats", targetUser?.id],
    () => fetchPrivateChat(user && targetUser && [user.id!, targetUser.id])
  );

  function messageHandler(msg: ClientMsg) {
    if (msg.author.id !== targetUser?.id) return;
    setMessages((prev) => [...prev, msg]);
  }

  function sendMessageFn(message: string) {
    socket.emit(
      EventTypes.CREATE_PRIVATE_MESSAGE,
      {
        author: user,
        content: message,
      },
      targetUser?.id
    );
  }

  function typingHandler({ isTyping, targetUserId }: TypingPrivateMsg) {
    if (targetUser?.id !== targetUserId) return;
    setShowTyping(isTyping);
  }

  function typingOnHandler() {
    socket.emit(EventTypes.TYPING_PRIVATE, {
      isTyping: true,
      targetUserId: targetUser?.id,
    });
  }

  function typingOffHandler() {
    socket.emit(EventTypes.TYPING_PRIVATE, {
      isTyping: false,
      targetUserId: targetUser?.id,
    });
  }

  useEffect(() => {
    socket
      .on(EventTypes.CLIENT_PRIVATE_MESSAGE, messageHandler)
      .on(EventTypes.TYPING_PRIVATE, typingHandler);
    return () => {
      socket
        .off(EventTypes.CLIENT_PRIVATE_MESSAGE, messageHandler)
        .off(EventTypes.TYPING_PRIVATE, typingHandler);
    };
  }, [socket, messageHandler, typingHandler]);

  useEffect(() => {
    const chatWindow = document.getElementById("chat-window");
    if (!chatWindow) return;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [data, messages, targetUser]);

  useEffect(() => {
    setMessages(data ? data.messages : []);
  }, [data, targetUser]);

  return (
    <div className="flex flex-col w-96 gap-2">
      <div className="flex flex-col gap-2 h-96 w-full">
        <div className="flex justify-between h-9 pl-3 pr-1 py-1 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg shadow-lg">
          <h1
            className={`text-xl ${
              targetUser ? "text-zinc-900 dark:text-zinc-300" : "text-zinc-500"
            }`}
          >
            {targetUser ? targetUser.username : "--no user selected--"}
          </h1>
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
      <MessageInput
        sendMessageFn={sendMessageFn}
        typingOnHandler={typingOnHandler}
        typingOffHandler={typingOffHandler}
      />
    </div>
  );
}

export default PrivateChatWindow;
