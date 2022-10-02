import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";

import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

function MessageInput({
  sendMessageFn,
  typingOnHandler,
  typingOffHandler,
  disabled = false,
}: {
  sendMessageFn: (message: string) => void;
  typingOnHandler: () => void;
  typingOffHandler: () => void;
  disabled?: boolean;
}) {
  const [messageInput, setMessageInput] = useState("");

  function messageInputChangeHandler(event: ChangeEvent<HTMLTextAreaElement>) {
    setMessageInput(event.target.value);
  }

  function submitMessage() {
    if (!messageInput.trim()) return;
    sendMessageFn(messageInput);
    setMessageInput("");
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
            placeholder={disabled ? "" : "type a message..."}
            className="px-2 py-1 w-full resize-none overflow-y-auto text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-900 placeholder:text-zinc-500 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/25 hover:scrollbar-thumb-black/30 dark:scrollbar-thumb-white/25 dark:hover:scrollbar-thumb-white/30"
            disabled={disabled}
          />
        </div>
        <button
          type="submit"
          className="p-2 h-11 w-11 my-auto mx-2 transition bg-emerald-500 hover:enabled:bg-emerald-400 rounded-full shadow-lg hover:enabled:shadow-xl disabled:bg-zinc-500"
          disabled={disabled}
        >
          <PaperAirplaneIcon className="ml-0.5 h-6 w-6" />
        </button>
      </div>
    </form>
  );
}

export default MessageInput;
