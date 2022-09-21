import { useAtom } from "jotai";
import { useEffect } from "react";

import ChatScreen from "./screens/chat";
import DarkModeSwitch from "./components/ui/dark-mode-switch";
import StartScreen from "./screens/start";
import {
  currentRoomSetterAtom,
  roomsSetterAtom,
  socketAtom,
  socketConnectedGetterAtom,
  socketConnectedSetterAtom,
  usersSetterAtom,
} from "./lib/atoms";
import { EventTypes } from "./lib/constants";

function App() {
  const [socket] = useAtom(socketAtom);
  const [, setCurrentRoom] = useAtom(currentRoomSetterAtom);
  const [, setRooms] = useAtom(roomsSetterAtom);
  const [connected] = useAtom(socketConnectedGetterAtom);
  const [, setConnected] = useAtom(socketConnectedSetterAtom);
  const [, setUsers] = useAtom(usersSetterAtom);

  function connectListener() {
    setConnected(true);
  }

  function disconnectListener() {
    setConnected(false);
  }

  function syncUsersListener({ users }: SyncUsersMsg) {
    setUsers(users);
  }

  useEffect(() => {
    socket
      .on(EventTypes.CONNECT, connectListener)
      .on(EventTypes.DISCONNECT, disconnectListener)
      .on(EventTypes.SYNC_USERS, syncUsersListener);
    return () => {
      socket
        .off(EventTypes.CONNECT, connectListener)
        .off(EventTypes.DISCONNECT, disconnectListener)
        .off(EventTypes.SYNC_USERS, syncUsersListener);
    };
  }, [socket]);

  function disconnectHandler() {
    if (!socket.connected) return;
    socket.disconnect();
    setUsers([]);
    setRooms([]);
    setCurrentRoom(null);
  }

  return (
    <div className="h-screen relative bg-gradient-to-tr from-fuchsia-800 to-cyan-800 transition-colors">
      <DarkModeSwitch className="absolute right-3 top-3" />
      {connected && (
        <button
          className="border border-red-500 text-zinc-800 dark:text-zinc-100 p-2 uppercase rounded"
          onClick={disconnectHandler}
        >
          disconnect
        </button>
      )}
      {!connected && <StartScreen />}
      {connected && <ChatScreen />}
    </div>
  );
}

export default App;
