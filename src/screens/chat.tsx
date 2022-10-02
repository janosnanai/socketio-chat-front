import { useAtom } from "jotai";
import { useEffect } from "react";

import Sidebar from "../components/sidebar";
import ChatWindow from "../components/chat-window";
import { usersTypingPrivateDispatchAtom, socketAtom } from "../lib/atoms";
import { EventTypes, UsersTypingPrivateActionTypes } from "../lib/constants";

function ChatScreen() {
  const [, usersTypingPrivateDispatch] = useAtom(
    usersTypingPrivateDispatchAtom
  );
  const [socket] = useAtom(socketAtom);

  function typingHandler({
    isTyping,
    targetUserId,
  }: {
    isTyping: boolean;
    targetUserId: string;
  }) {
    if (isTyping) {
      usersTypingPrivateDispatch({
        type: UsersTypingPrivateActionTypes.ADD_USER,
        payload: targetUserId,
      });
    }
    if (!isTyping) {
      usersTypingPrivateDispatch({
        type: UsersTypingPrivateActionTypes.REMOVE_USER,
        payload: targetUserId,
      });
    }
  }

  useEffect(() => {
    socket.on(EventTypes.TYPING_PRIVATE, typingHandler);
    return () => {
      socket.off(EventTypes.TYPING_PRIVATE, typingHandler);
    };
  }, [socket, typingHandler]);

  return (
    <div className="flex gap-5 justify-center pt-12">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default ChatScreen;
