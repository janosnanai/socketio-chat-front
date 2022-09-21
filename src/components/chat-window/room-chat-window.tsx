import { EventTypes } from "../../lib/constants";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ClientMessageBubble from "./client-message-bubble";
import { fetchRoomChat } from "../../lib/api/fetch-chat";
import {
  thisUserGetterAtom,
  socketAtom,
  currentRoomGetterAtom,
} from "../../lib/atoms";
import { MessageTypes } from "../../lib/constants";
import ServerMessageBubble from "./server-message-bubble";

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
    const chatWindow = document.getElementById("chat-window");
    console.log(chatWindow);

    if (!chatWindow) return;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [data, messages, room]);

  useEffect(() => {
    setMessages(data ? data.messages : []);
  }, [data, room]);

  return (
    <div className="flex flex-col h-96 w-full bg-zinc-200 dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
      {room && (
        <>
          <h1 className="px-2 py-1 text-zinc-900 dark:text-zinc-300 bg-zinc-300 dark:bg-zinc-800">
            {room.name}
          </h1>
          <div
            id="chat-window"
            className="flex-grow w-full pr-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/25 hover:scrollbar-thumb-black/30 dark:scrollbar-thumb-white/25 dark:hover:scrollbar-thumb-white/30"
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
