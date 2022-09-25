import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";

import { useAtom } from "jotai";
import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

import {
  currentRoomGetterAtom,
  socketAtom,
  thisUserGetterAtom,
} from "../../lib/atoms";
import { EventTypes } from "../../lib/constants";

function MessageInput({ disabled = false }: { disabled?: boolean }) {
  const [messageInput, setMessageInput] = useState("");
  const [currentRoom] = useAtom(currentRoomGetterAtom);
  const [socket] = useAtom(socketAtom);
  const [user] = useAtom(thisUserGetterAtom);

  function messageInputChangeHandler(event: ChangeEvent<HTMLTextAreaElement>) {
    setMessageInput(event.target.value);
  }

  function submitMessage() {
    if (!messageInput.trim()) return;
    socket.emit(EventTypes.CREATE_MESSAGE, {
      author: user,
      content: messageInput,
    });
    setMessageInput("");
  }

  function typingOnHandler() {
    socket.emit(EventTypes.TYPING, { isTyping: true });
  }

  function typingOffHandler() {
    socket.emit(EventTypes.TYPING, { isTyping: false });
  }

  function submitHandler(event?: FormEvent) {
    event?.preventDefault();
    submitMessage();
  }

  function keyDownHandler(event: KeyboardEvent) {
    if (event.code !== "Enter") return;
    event.preventDefault();
    submitMessage();
  }

  return (
    <form onSubmit={submitHandler}>
      <div className="flex">
        <div className="w-80 h-14 rounded-lg shadow-lg overflow-hidden">
          <label className="sr-only">message</label>
          <textarea
            onChange={messageInputChangeHandler}
            onFocus={typingOnHandler}
            onBlur={typingOffHandler}
            onKeyDown={keyDownHandler}
            value={messageInput}
            id="message"
            rows={2}
            placeholder={disabled || !currentRoom ? "" : "type a message..."}
            className="px-2 py-1 w-full resize-none overflow-y-auto text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-900 placeholder:text-zinc-500 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/25 hover:scrollbar-thumb-black/30 dark:scrollbar-thumb-white/25 dark:hover:scrollbar-thumb-white/30"
            disabled={disabled || !currentRoom}
          />
        </div>
        <button
          type="submit"
          className="p-2 h-11 w-11 my-auto mx-2 transition bg-emerald-500 hover:enabled:bg-emerald-400 rounded-full shadow-lg hover:enabled:shadow-xl disabled:bg-zinc-500"
          disabled={disabled || !currentRoom}
        >
          <PaperAirplaneIcon className="ml-0.5 h-6 w-6" />
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
