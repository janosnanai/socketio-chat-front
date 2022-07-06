import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { nanoid } from "nanoid";

import ChatServerEntry from "./chat-server-entry";
import ChatUserEntry from "./chat-user-entry";

function ChatMain(props: { socket: Socket }) {
  const firstRenderRef = useRef(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [clientName, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const { socket } = props;

  useEffect(() => {
    if (!firstRenderRef.current) return;

    socket.on("message", ({ msg, msgId, senderId, senderName }) => {
      console.log("incoming msg:", msg);
      setMessages((prev) => [...prev, { msg, msgId, senderId, senderName }]);
    });

    setName(`guest-${nanoid(8)}`);
    setClientId(nanoid(12));

    firstRenderRef.current = false;
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages]);

  function sendHandler(event: FormEvent) {
    event.preventDefault();

    if (socket.connected && messageInput) {
      socket.emit("clientMsg", {
        msg: messageInput,
        senderName: clientName,
        senderId: clientId,
      });
      setMessageInput("");
    }
  }

  function textChangeHandler(event: ChangeEvent<HTMLTextAreaElement>) {
    setMessageInput(event.target.value);
  }

  return (
    <div className="w-96 m-auto pt-10 px-5">
      <div className="text-zinc-300 bg-zinc-800 rounded-md p-2 h-96 overflow-y-auto">
        <ul className="space-y-2">
          {messages.map((chatMsg) => {
            if (chatMsg.senderId === "server") {
              return <ChatServerEntry key={chatMsg.msgId} msg={chatMsg.msg} />;
            }
            return (
              <ChatUserEntry
                key={chatMsg.msgId}
                msg={chatMsg.msg}
                senderName={chatMsg.senderName}
              />
            );
          })}
        </ul>
        <div ref={bottomRef}></div>
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
