import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Disclosure, RadioGroup } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { UsersIcon, UserCircleIcon } from "@heroicons/react/20/solid";

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
    <aside className="p-3 rounded-lg bg-zinc-900">
      <RadioGroup value={currentRoom} onChange={changeHandler}>
        <div className="space-y-2">
          {roomsWithUsers &&
            rooms.map((room) => (
              <div className="flex gap-3" key={"r" + room.id}>
                <RadioGroup.Option value={room} className="h-min">
                  {({ checked }) => (
                    <span
                      className={`cursor-pointer inline-block mt-3 h-5 w-5 rounded-full transition-colors duration-300 ease-out hover:border-spacing-2 ${
                        checked
                          ? "bg-emerald-500"
                          : "bg-neutral-600 hover:bg-neutral-500"
                      }`}
                    />
                  )}
                </RadioGroup.Option>
                <div>
                  <Disclosure defaultOpen>
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`p-2 rounded-lg transition-colors group duration-300 ${
                            currentRoom?.id === room.id
                              ? "text-emerald-300 bg-zinc-700"
                              : "text-zinc-400 hover:text-zinc-200 bg-zinc-800"
                          }`}
                        >
                          <div className="flex justify-between items-center w-44">
                            <div>
                              <h3 className="inline-block leading-none truncate">
                                {room.name}
                              </h3>
                              <div className="flex gap-0.5 items-center">
                                <UsersIcon className="h-2.5 w-2.5" />
                                <span className="inline-block text-xs font-mono">
                                  {Array.isArray(roomsWithUsers[room.id]) &&
                                    roomsWithUsers[room.id].length}
                                </span>
                              </div>
                            </div>
                            <ChevronRightIcon
                              className={`h-7 w-7 p-1 rounded-full group-hover:bg-zinc-600 transition-all duration-300 ${
                                open ? "rotate-90" : "rotate-0"
                              }`}
                            />
                          </div>
                        </Disclosure.Button>
                        <Disclosure.Panel as="ul">
                          {roomsWithUsers[room.id] &&
                            roomsWithUsers[room.id].map((user) => (
                              <li
                                key={user.id}
                                className="text-zinc-500 flex gap-1 items-center"
                              >
                                <span className="inline-block">
                                  <UserCircleIcon className="h-3 w-3" />
                                </span>
                                <span className="inline-block">
                                  {user.username}
                                </span>
                              </li>
                            ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </div>
            ))}
        </div>
      </RadioGroup>
    </aside>
  );
}

export default RoomsBar;
