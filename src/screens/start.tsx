import type { FocusEvent } from "react";

import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { ChangeEvent, useState } from "react";

import {
  currentRoomSetterAtom,
  roomsSetterAtom,
  socketAtom,
  thisUserGetterAtom,
  thisUserSetterAtom,
} from "../lib/atoms";
import { EventTypes } from "../lib/constants";

function StartScreen() {
  const [user] = useAtom(thisUserGetterAtom);
  const [, setUser] = useAtom(thisUserSetterAtom);
  const [usernameInput, setUsernameInput] = useState(user.username);
  const [socket] = useAtom(socketAtom);
  const [, setRooms] = useAtom(roomsSetterAtom);
  const [, setCurrentRoom] = useAtom(currentRoomSetterAtom);

  function connectHandler() {
    if (socket.connected) return;
    setUser({ username: usernameInput, id: nanoid() });
    socket.connect().emit(
      EventTypes.NEW_USER,
      { username: usernameInput },
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

  function focusHandler(event: FocusEvent<HTMLInputElement>) {
    event.target.select();
  }

  function inputChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    const username = event.target.value;
    setUsernameInput(username);
  }

  return (
    <div>
      <input
        onChange={inputChangeHandler}
        onFocus={focusHandler}
        value={usernameInput}
        type="text"
        placeholder="enter a username..."
      />
      <button
        className="border border-green-500 text-zinc-800 dark:text-zinc-100 p-2 uppercase rounded"
        onClick={connectHandler}
      >
        connect
      </button>
    </div>
  );
}

export default StartScreen;
