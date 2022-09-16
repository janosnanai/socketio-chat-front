import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";

import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

import DarkModeSwitch from "./components/ui/dark-mode-switch";
import RoomsBar from "./components/rooms-bar";
import {
  darkModeGetterAtom,
  currentRoomSetterAtom,
  roomsSetterAtom,
  thisUserGetterAtom,
  thisUserSetterAtom,
  usersSetterAtom,
} from "./lib/atoms";
import { EventTypes, MessageTypes } from "./lib/constants";

const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS!;

function App() {
  const firstRenderRef = useRef(true);
  const socket = useMemo(() => io(SERVER_ADDRESS, { autoConnect: false }), []);

  const [darkMode] = useAtom(darkModeGetterAtom);
  const [, setCurrentRoom] = useAtom(currentRoomSetterAtom);
  const [, setRooms] = useAtom(roomsSetterAtom);
  const [connected, setConnected] = useState(socket.connected);
  const [nameInput, setNameInput] = useState("anonymus");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<(ClientMsg | ServerMsg)[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [, setUsers] = useAtom(usersSetterAtom);

  const chatWindow = document.getElementById("chat-window");
  const appRoot = document.getElementById("app-root");

  const initSocket = useCallback(() => {
    socket.on(EventTypes.CONNECT, () => {
      setConnected(true);
    });

    socket.on(EventTypes.DISCONNECT, () => {
      setConnected(false);
    });

    socket.on(EventTypes.CLIENT_MESSAGE, (msg: ClientMsg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on(EventTypes.SERVER_MESSAGE, (msg: ServerMsg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on(EventTypes.TYPING, ({ isTyping }: TypingMsg) => {
      setShowTyping(isTyping);
    });

    socket.on(EventTypes.SYNC_USERS, ({ users }: SyncUsersMsg) => {
      setUsers(users);
    });
  }, [socket]);

  useEffect(() => {
    // hack to avoid react 18 doublerendering
    if (!firstRenderRef.current) return;

    initSocket();

    firstRenderRef.current = false;
  }, [initSocket]);

  useEffect(() => {
    if (darkMode) {
      appRoot?.classList.add("dark");
    } else {
      appRoot?.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (!chatWindow) return;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, [messages]);

  function connectHandler() {
    if (!socket.connected) {
      socket.connect().emit(
        EventTypes.NEW_USER,
        { username: nameInput },
        // receive rooms from server
        ({ rooms: newRooms }: SyncRoomsMsg) => {
          setRooms(newRooms);
          if (!newRooms.length) return;
          const starterRoom = newRooms[0];
          socket.emit(EventTypes.JOIN_ROOM, { roomId: starterRoom.id }, () =>
            setCurrentRoom(starterRoom)
          );
        }
      );
    }
  }

  function disconnectHandler() {
    if (socket.connected) {
      socket.disconnect();
    }
    setUsers([]);
    setRooms([]);
    setCurrentRoom(null);
  }

  function changeRoomHandler(selectedRoom: Room | null) {
    if (!selectedRoom) return;
    socket.emit(EventTypes.JOIN_ROOM, { roomId: selectedRoom.id }, () => {
      setCurrentRoom(selectedRoom);
    });
  }

  function nameInputChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    setNameInput(event.target.value);
  }

  function messageInputChangeHandler(event: ChangeEvent<HTMLTextAreaElement>) {
    setMessageInput(event.target.value);
  }

  function typingOnHandler() {
    socket.emit(EventTypes.TYPING, { isTyping: true });
  }

  function typingOffHandler() {
    socket.emit(EventTypes.TYPING, { isTyping: false });
  }

  function submitMessage() {
    if (!messageInput.trim()) return;
    socket.emit(EventTypes.CREATE_MESSAGE, {
      author: nameInput,
      content: messageInput,
    });
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
    <div className="h-screen relative bg-zinc-100 dark:bg-zinc-800 transition-colors">
      <DarkModeSwitch className="absolute right-3 top-3" />
      <div className="flex justify-center pt-12">
        <RoomsBar changeHandler={changeRoomHandler} />
        <div className="flex flex-col w-96 m-auto gap-2">
          <div
            id="chat-window"
            className="h-96 w-full overflow-y-auto bg-zinc-200 dark:bg-zinc-700"
          >
            <ul>
              {messages.map((message) => {
                if (message.type === MessageTypes.SERVER) {
                  return (
                    <li key={message.id}>
                      <p className="text-sm text-center text-zinc-500">
                        {(message as ServerMsg).content}
                      </p>
                    </li>
                  );
                }
                if (message.type === MessageTypes.CLIENT) {
                  return (
                    <li key={message.id}>
                      <p>{`${(message as ClientMsg).content} -- ${
                        (message as ClientMsg).author
                      }`}</p>
                    </li>
                  );
                }
              })}
            </ul>
            <p className="h-6 w-full">
              {showTyping && "somebody is typing a message..."}
            </p>
          </div>
          <form onSubmit={submitHandler}>
            <div>
              <label
                htmlFor="name"
                className="block mr-2 text-zinc-700 dark:text-zinc-400"
              >
                your name
              </label>
              <input
                onChange={nameInputChangeHandler}
                value={nameInput}
                id="name"
                type="text"
                placeholder="enter a name..."
                className="px-2 py-1 w-full bg-zinc-200 dark:bg-zinc-700 placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-zinc-700 dark:text-zinc-400"
              >
                message
              </label>
              <textarea
                onChange={messageInputChangeHandler}
                onFocus={typingOnHandler}
                onBlur={typingOffHandler}
                onKeyDown={keyDownHandler}
                value={messageInput}
                id="message"
                rows={5}
                placeholder="type a message..."
                className="px-2 py-1 w-full resize-none overflow-y-auto bg-zinc-200 dark:bg-zinc-700 placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400"
              />
            </div>
            <button
              type="submit"
              className="border p-2 uppercase w-full bg-emerald-500 rounded"
            >
              send
            </button>
          </form>
          {connected && (
            <button
              className="border border-red-500 text-zinc-800 dark:text-zinc-100 p-2 uppercase rounded"
              onClick={disconnectHandler}
            >
              disconnect
            </button>
          )}
          {!connected && (
            <button
              className="border border-green-500 text-zinc-800 dark:text-zinc-100 p-2 uppercase rounded"
              onClick={connectHandler}
            >
              connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
