import { EventTypes } from "../../lib/constants";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ChatMessages from "./chat-messages";
import MessageInput from "./message-input";
import { fetchRoomChat } from "../../lib/api/fetch-chat";
import {
  thisUserGetterAtom,
  socketAtom,
  currentRoomGetterAtom,
  currentRoomSetterAtom,
} from "../../lib/atoms";

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

  function sendMessageFn(message: string) {
    socket.emit(EventTypes.CREATE_ROOM_MESSAGE, {
      author: user,
      content: message,
    });
  }

  function typingHandler({ isTyping }: TypingRoomMsg) {
    setShowTyping(isTyping);
  }

  function typingOnHandler() {
    socket.emit(EventTypes.TYPING_ROOM, { isTyping: true });
  }

  function typingOffHandler() {
    socket.emit(EventTypes.TYPING_ROOM, { isTyping: false });
  }

  function leaveRoomhandler() {
    socket.emit(EventTypes.LEAVE_ROOM, () => {
      setRoom(null);
    });
  }

  useEffect(() => {
    socket
      .on(EventTypes.CLIENT_ROOM_MESSAGE, messageHandler)
      .on(EventTypes.SERVER_MESSAGE, messageHandler)
      .on(EventTypes.TYPING_ROOM, typingHandler);
    return () => {
      socket
        .off(EventTypes.CLIENT_ROOM_MESSAGE, messageHandler)
        .off(EventTypes.SERVER_MESSAGE, messageHandler)
        .off(EventTypes.TYPING_ROOM, typingHandler);
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
    <div className="flex flex-col w-96 gap-2">
      <ChatMessages
        title={room?.name}
        user={user}
        messages={messages}
        showTyping={showTyping}
        leaveHandler={leaveRoomhandler}
      />

      <MessageInput
        sendMessageFn={sendMessageFn}
        typingOnHandler={typingOnHandler}
        typingOffHandler={typingOffHandler}
      />
    </div>
  );
}

export default RoomChatWindow;
