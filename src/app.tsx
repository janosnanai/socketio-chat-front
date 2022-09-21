import { useAtom } from "jotai";
import { useEffect } from "react";

import RoomChatWindow from "./components/chat-window/room-chat-window";
import DarkModeSwitch from "./components/ui/dark-mode-switch";
import MessageInput from "./components/chat-window/message-input";
import RoomsBar from "./components/sidebar";
import {
  currentRoomSetterAtom,
  currentRoomGetterAtom,
  roomsSetterAtom,
  socketAtom,
  socketConnectedGetterAtom,
  socketConnectedSetterAtom,
  thisUserGetterAtom,
  thisUserSetterAtom,
  usersSetterAtom,
} from "./lib/atoms";
import { EventTypes } from "./lib/constants";

function App() {
  const [socket] = useAtom(socketAtom);
  const [currentRoom] = useAtom(currentRoomGetterAtom);
  const [, setCurrentRoom] = useAtom(currentRoomSetterAtom);
  const [, setRooms] = useAtom(roomsSetterAtom);
  const [connected] = useAtom(socketConnectedGetterAtom);
  const [, setConnected] = useAtom(socketConnectedSetterAtom);
  const [user] = useAtom(thisUserGetterAtom);
  const [, setUser] = useAtom(thisUserSetterAtom);
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

  function connectHandler() {
    if (socket.connected) return;
    socket.connect().emit(
      EventTypes.NEW_USER,
      { username: user.username },
      // receive rooms from server
      ({ rooms: newRooms }: SyncRoomsMsg) => {
        setRooms(newRooms);
        setUser({ username: user.username, id: socket.id });
        if (!newRooms.length) return;
        const starterRoom = newRooms[0];
        socket.emit(EventTypes.JOIN_ROOM, { roomId: starterRoom.id }, () =>
          setCurrentRoom(starterRoom)
        );
      }
    );
  }

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
      <div className="flex gap-5 justify-center pt-12">
        <RoomsBar />
        <div className="flex flex-col w-96 gap-2">
          <RoomChatWindow />
          <MessageInput />
        </div>
      </div>
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
  );
}

export default App;
