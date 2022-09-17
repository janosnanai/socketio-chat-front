import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";

import ChatMessages from "./components/chat-window/chat-messages";
import DarkModeSwitch from "./components/ui/dark-mode-switch";
import MessageInput from "./components/chat-window/message-input";
import RoomsBar from "./components/rooms-bar";
import {
  currentRoomSetterAtom,
  messagesSetterAtom,
  roomsSetterAtom,
  socketAtom,
  socketConnectedGetterAtom,
  socketConnectedSetterAtom,
  thisUserGetterAtom,
  usersSetterAtom,
  usersTypingSetterAtom,
} from "./lib/atoms";
import { EventTypes } from "./lib/constants";

function App() {
  const firstRenderRef = useRef(true);
  const [socket] = useAtom(socketAtom);
  const [, setCurrentRoom] = useAtom(currentRoomSetterAtom);
  const [, setRooms] = useAtom(roomsSetterAtom);
  const [connected] = useAtom(socketConnectedGetterAtom);
  const [, setConnected] = useAtom(socketConnectedSetterAtom);
  const [user] = useAtom(thisUserGetterAtom);
  const [, setMessages] = useAtom(messagesSetterAtom);
  const [, setShowTyping] = useAtom(usersTypingSetterAtom);
  const [, setUsers] = useAtom(usersSetterAtom);

  const initSocket = useCallback(() => {
    socket
      .on(EventTypes.CONNECT, () => {
        setConnected(true);
      })
      .on(EventTypes.DISCONNECT, () => {
        setConnected(false);
      })
      .on(EventTypes.CLIENT_MESSAGE, (msg: ClientMsg) => {
        setMessages(msg);
      })
      .on(EventTypes.SERVER_MESSAGE, (msg: ServerMsg) => {
        setMessages(msg);
      })
      .on(EventTypes.TYPING, ({ isTyping }: TypingMsg) => {
        setShowTyping(isTyping);
      })
      .on(EventTypes.SYNC_USERS, ({ users }: SyncUsersMsg) => {
        setUsers(users);
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
      socket.connect().emit(
        EventTypes.NEW_USER,
        { username: user.username },
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

  return (
    <div className="h-screen relative bg-gradient-to-tr from-fuchsia-800 to-cyan-800 transition-colors">
      <DarkModeSwitch className="absolute right-3 top-3" />
      <div className="flex gap-5 justify-center pt-12">
        <RoomsBar changeHandler={changeRoomHandler} />
        <div className="flex flex-col w-96 gap-2">
          <ChatMessages />
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
