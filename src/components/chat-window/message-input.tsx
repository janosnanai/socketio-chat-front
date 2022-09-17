import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";

import { useAtom } from "jotai";
import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

import { socketAtom, thisUserGetterAtom } from "../../lib/atoms";
import { EventTypes } from "../../lib/constants";

function MessageInput() {
  const [messageInput, setMessageInput] = useState("");
  const [socket] = useAtom(socketAtom);
  const [user] = useAtom(thisUserGetterAtom);

  function messageInputChangeHandler(event: ChangeEvent<HTMLTextAreaElement>) {
    setMessageInput(event.target.value);
  }

  function submitMessage() {
    if (!messageInput.trim()) return;
    socket.emit(EventTypes.CREATE_MESSAGE, {
      author: user.username,
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
        <label className="sr-only">message</label>
        <textarea
          onChange={messageInputChangeHandler}
          onFocus={typingOnHandler}
          onBlur={typingOffHandler}
          onKeyDown={keyDownHandler}
          value={messageInput}
          id="message"
          rows={2}
          placeholder="type a message..."
          className="px-2 py-1 w-full resize-none rounded-l-lg overflow-y-auto bg-zinc-900 text-zinc-100 placeholder:text-zinc-400 shadow-lg"
        />
        <button
          type="submit"
          className="p-2 w-11 bg-emerald-500 hover:bg-emerald-400 rounded-r-lg"
        >
          <PaperAirplaneIcon className="h-6 w-6" />
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
