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
  currentRoomSetterAtom,
} from "../../lib/atoms";
import { MessageTypes } from "../../lib/constants";
import ServerMessageBubble from "./server-message-bubble";

function RoomChatWindow() {
  const [room] = useAtom(currentRoomGetterAtom);
  const [, setRoom] = useAtom(currentRoomSetterAtom);
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

  function leaveRoomhandler() {
    socket.emit(EventTypes.LEAVE_ROOM, () => {
      setRoom(null);
    });
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
    if (!chatWindow) return;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [data, messages, room]);

  useEffect(() => {
    setMessages(data ? data.messages : []);
  }, [data, room]);

  return (
    <div className="flex flex-col gap-2 h-96 w-full">
      {room && (
        <>
          <div className="flex justify-between h-9 pl-3 pr-1 py-1 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg shadow-lg">
            <h1 className="text-xl text-zinc-900 dark:text-zinc-300">
              {room.name}
            </h1>
            {socket.connected && (
              <button
                onClick={leaveRoomhandler}
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
              <p className="h-6 w-full">
                {showTyping && "somebody is typing a message..."}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RoomChatWindow;
