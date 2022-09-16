import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Disclosure, RadioGroup } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

import {
  currentRoomGetterAtom,
  roomsGetterAtom,
  usersGetterAtom,
} from "../../lib/atoms";
import { generateRoomsWithUsers } from "../../lib/helpers";

function RoomsBar({
  changeHandler,
}: {
  changeHandler: (value: Room | null) => void;
}) {
  const [users] = useAtom(usersGetterAtom);
  const [rooms] = useAtom(roomsGetterAtom);
  const [currentRoom] = useAtom(currentRoomGetterAtom);
  const [roomsWithUsers, setRoomsWithUsers] = useState<RoomsWithUsers | null>(
    null
  );

  useEffect(() => {
    if (!rooms) return;
    setRoomsWithUsers(generateRoomsWithUsers(rooms, users));
  }, [rooms, users]);

  return (
    <aside>
      <RadioGroup value={currentRoom} onChange={changeHandler}>
        {roomsWithUsers &&
          rooms.map((room) => (
            <div className="flex gap-3" key={"r" + room.id}>
              <RadioGroup.Option value={room}>
                {({ checked }) => (
                  <span
                    className={`inline-block h-6 w-6 rounded-full ${
                      checked ? "bg-emerald-500" : "bg-neutral-500"
                    }`}
                  />
                )}
              </RadioGroup.Option>
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button>
                      <span>{room.name}</span>
                      <ChevronRightIcon className="h-6 w-6" />
                    </Disclosure.Button>
                    <Disclosure.Panel>
                      <ul>
                        {roomsWithUsers[room.id] &&
                          roomsWithUsers[room.id].map((user) => (
                            <li key={user.id}>{user.username}</li>
                          ))}
                      </ul>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          ))}
      </RadioGroup>
    </aside>
  );
}

export default RoomsBar;
