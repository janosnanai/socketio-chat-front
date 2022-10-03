import { EventTypes } from "../../lib/constants";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ChatMessages from "./chat-messages";
import MessageInput from "./message-input";
import { fetchPrivateChat } from "../../lib/api/fetch-chat";
import {
  targetUserGetterAtom,
  targetUserSetterAtom,
  thisUserGetterAtom,
  socketAtom,
} from "../../lib/atoms";

function PrivateChatWindow() {
  const [socket] = useAtom(socketAtom);
  const [targetUser] = useAtom(targetUserGetterAtom);
  const [, setTargetUser] = useAtom(targetUserSetterAtom);
  const [user] = useAtom(thisUserGetterAtom);
  const [messages, setMessages] = useState<(ClientMsg | ServerMsg)[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const { isLoading, isFetching, data, error } = useQuery(
    ["private-chats", targetUser?.id],
    () => fetchPrivateChat(user && targetUser && [user.id!, targetUser.id])
  );

  function messageHandler(msg: ClientMsg) {
    if (msg.author.id !== targetUser?.id && msg.author.id !== user.id) return;
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

  function leaveChatHandler() {
    setTargetUser(null);
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
      <ChatMessages
        title={targetUser?.username}
        user={user}
        messages={messages}
        showTyping={showTyping}
        leaveHandler={leaveChatHandler}
      />

      <MessageInput
        sendMessageFn={sendMessageFn}
        typingOnHandler={typingOnHandler}
        typingOffHandler={typingOffHandler}
      />
    </div>
  );
}

export default PrivateChatWindow;
