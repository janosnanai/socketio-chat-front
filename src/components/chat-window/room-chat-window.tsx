import { EventTypes } from "../../lib/constants";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import MessageBubble from "./message-bubble";
import { fetchRoomChat } from "../../lib/api/fetch-chat";
import {
  thisUserGetterAtom,
  socketAtom,
  currentRoomGetterAtom,
} from "../../lib/atoms";
import { MessageTypes } from "../../lib/constants";

function RoomChatWindow() {
  const [room] = useAtom(currentRoomGetterAtom);
  const [socket] = useAtom(socketAtom);
  const [messages, setMessages] = useState<(ClientMsg | ServerMsg)[]>([]);
  const { isLoading, isFetching, data, error } = useQuery(
    ["room-chats", room?.id],
    () => fetchRoomChat(room?.id)
  );
  const [user] = useAtom(thisUserGetterAtom);
  const [showTyping, setShowTyping] = useState(false);
  const chatWindow = document.getElementById("chat-window");

  function messageHandler(msg: ClientMsg) {
    setMessages((prev) => [...prev, msg]);
  }

  function typingHandler({ isTyping }: TypingMsg) {
    setShowTyping(isTyping);
  }

  useEffect(() => {
    socket
      .on(EventTypes.CLIENT_MESSAGE, messageHandler)
      .on(EventTypes.SERVER_MESSAGE, messageHandler)
      .on(EventTypes.TYPING, typingHandler);
    return () => {
      socket
        .off(EventTypes.CLIENT_MESSAGE, messageHandler)
        .off(EventTypes.SERVER_MESSAGE, messageHandler)
        .off(EventTypes.TYPING, typingHandler);
    };
  }, [socket]);

  useEffect(() => {
    if (!chatWindow) return;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [data]);

  useEffect(() => {
    setMessages(data ? data.messages : []);
  }, [data, room]);

  return (
    <div className="h-96 w-full bg-zinc-200 dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
      {room && (
        <>
          <h1 className="px-2 py-1 text-zinc-900 dark:text-zinc-300 bg-zinc-300 dark:bg-zinc-800">
            {room.name}
          </h1>
          <div
            id="chat-window"
            className="h-full w-full pr-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/25 hover:scrollbar-thumb-black/30 dark:scrollbar-thumb-white/25 dark:hover:scrollbar-thumb-white/30"
          >
            {messages && (
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
            )}
            <p className="h-6 w-full">
              {showTyping && "somebody is typing a message..."}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default RoomChatWindow;
