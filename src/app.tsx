import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ChatMain from "./components/chat/chat-main";
import LayoutMain from "./components/layout/layout-main";

import { io } from "socket.io-client";

const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS!;

function App() {
  const firstRenderRef = useRef(true);

  const [connected, setConnected] = useState(false);

  const socket = useMemo(() => io(SERVER_ADDRESS, { autoConnect: false }), []);

  const initSocket = useCallback(() => {
    socket.on("connect", () => {
      console.log("connected to", SERVER_ADDRESS, "| socket id:", socket!.id);

      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log(
        "disconnected from",
        SERVER_ADDRESS,
        "| socket id:",
        socket!.id
      );

      setConnected(false);
    });
  }, [socket]);

  useEffect(() => {
    // hack to avoid react 18 doublerendering
    if (!firstRenderRef.current) return;

    initSocket();

    firstRenderRef.current = false;
  }, [initSocket]);

  function connectHandler() {
    if (!socket.connected) {
      socket.connect();
    }
  }

  function disconnectHandler() {
    if (socket.connected) {
      socket.disconnect();
    }
  }

  return (
    <LayoutMain>
      <main className="bg-zinc-900">
        <ChatMain socket={socket} />
        <div className="mx-auto w-96 p-5">
          {!connected && (
            <button
              onClick={connectHandler}
              className="w-full px-2 py-1 rounded-md uppercase bg-green-600 text-white"
            >
              connect
            </button>
          )}
          {connected && (
            <button
              onClick={disconnectHandler}
              className="w-full px-2 py-1 rounded-md uppercase bg-rose-500 text-white"
            >
              disconnect
            </button>
          )}
        </div>
      </main>
    </LayoutMain>
  );
}

export default App;
