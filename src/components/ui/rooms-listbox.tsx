import { useAtom } from "jotai";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

import { roomsGetterAtom, currentRoomGetterAtom } from "../../lib/atoms";

function RoomsListBox({
  changeHandler,
}: {
  changeHandler: (value: Room) => void;
}) {
  const [rooms] = useAtom(roomsGetterAtom);
  const [currentRoom] = useAtom(currentRoomGetterAtom);

  return (
    <Listbox value={currentRoom} onChange={changeHandler}>
      <div className="relative mt-1 w-96">
        <Listbox.Button className="relative w-full rounded-lg cursor-default text-left py-2 pl-3 bg-zinc-300 dark:bg-zinc-600">
          <span className="block truncate text-zinc-900 dark:text-zinc-200">
            {currentRoom?.name || "--no room selected--"}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-6 w-6 text-zinc-700 dark:text-zinc-400" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute w-full mt-1 max-h-64 overflow-auto rounded-lg py-1 bg-zinc-300 dark:bg-zinc-600">
          {rooms.map((room) => (
            <Listbox.Option key={"r" + room.id} value={room}>
              {room.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

export default RoomsListBox;
