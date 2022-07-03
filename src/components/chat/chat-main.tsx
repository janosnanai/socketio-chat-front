import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

import ChatServerEntry from "./chat-server-entry";
import ChatUserEntry from "./chat-user-entry";

function ChatMain(props: { socket: Socket }) {
  const firstRenderRef = useRef(true);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const { socket } = props;

  useEffect(() => {
    if (!firstRenderRef.current) return;

    socket.on("message", ({ msg, msgId, senderId }) => {
      console.log("incoming msg:", msg);
      setMessages((prev) => [...prev, { msg, msgId, senderId }]);
    });

    firstRenderRef.current = false;
  }, [socket]);

  const sendHandler = (event: FormEvent) => {
    event.preventDefault();

    if (socket.connected && messageInput) {
      socket.emit("clientMsg", messageInput);
      setMessageInput("");
    }
  };

  const textChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(event.target.value);
  };

  return (
    <div className="w-96 m-auto pt-10 px-5">
      <div className="text-zinc-300 bg-zinc-800 rounded-md p-2">
        <ul className="space-y-2">
          {messages.map((chatMsg) => {
            let type;
            switch (chatMsg.senderId) {
              case socket.id:
                type = "own";
                break;
              case "server":
                type = "server";
                break;
              default:
                type = "other-user";
            }
            return (
              <li key={chatMsg.msgId}>
                <ChatUserEntry msg={chatMsg.msg} type={type} />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-3">
        <form onSubmit={sendHandler}>
          <textarea
            className="w-full resize-none py-1 px-2 placeholder:text-zinc-500 text-zinc-300 bg-zinc-800 rounded-md"
            rows={3}
            placeholder="type you message here..."
            value={messageInput}
            onChange={textChangeHandler}
          />
          <div className="mt-1">
            <button
              className="w-full self-center px-2 py-1 rounded-md uppercase bg-indigo-500 hover:bg-indigo-400 disabled:bg-zinc-800 text-white disabled:text-zinc-500"
              disabled={!socket.connected || !messageInput}
            >
              send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatMain;
