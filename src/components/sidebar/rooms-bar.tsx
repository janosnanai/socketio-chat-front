import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";

import RoomItem from "./room-item";

import {
  currentRoomGetterAtom,
  currentRoomSetterAtom,
  roomsGetterAtom,
  socketAtom,
  usersGetterAtom,
} from "../../lib/atoms";
import { generateRoomsWithUsers } from "../../lib/helpers";
import { EventTypes } from "../../lib/constants";

function RoomsBar() {
  const [currentRoom] = useAtom(currentRoomGetterAtom);
  const [, setCurrentRoom] = useAtom(currentRoomSetterAtom);
  const [rooms] = useAtom(roomsGetterAtom);
  const [socket] = useAtom(socketAtom);
  const [users] = useAtom(usersGetterAtom);

  const [roomsWithUsers, setRoomsWithUsers] = useState<RoomsWithUsers | null>(
    null
  );

  useEffect(() => {
    if (!rooms) return;
    setRoomsWithUsers(generateRoomsWithUsers(rooms, users));
  }, [rooms, users]);

  function changeRoomHandler(selectedRoom: Room | null) {
    if (!selectedRoom) return;
    socket.emit(EventTypes.JOIN_ROOM, { roomId: selectedRoom.id }, () => {
      setCurrentRoom(selectedRoom);
    });
  }

  return (
    <RadioGroup value={currentRoom} onChange={changeRoomHandler}>
      <div className="space-y-2">
        {roomsWithUsers &&
          rooms.map((room) => {
            const selected = currentRoom?.id === room.id;
            const roomUsers = roomsWithUsers[room.id] || [];
            return (
              <div className="flex gap-3" key={"r" + room.id}>
                <RadioGroup.Option
                  value={room}
                  className={({ checked }) =>
                    `mt-3 cursor-pointer inline-block h-5 w-5 rounded-full transition-colors duration-300 ease-out ${
                      checked
                        ? "bg-emerald-500"
                        : "bg-neutral-600 hover:bg-neutral-500"
                    }`
                  }
                />
                <RoomItem room={room} users={roomUsers} selected={selected} />
              </div>
            );
          })}
      </div>
    </RadioGroup>
  );
}

export default RoomsBar;
