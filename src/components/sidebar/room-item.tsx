import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon, UsersIcon } from "@heroicons/react/20/solid";

function RoomItem({
  room,
  users,
  active = false,
}: {
  room: Room;
  users: User[];
  active?: boolean;
}) {
  return (
    <div>
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={`p-2 rounded-lg transition-colors group duration-300 ${
                active
                  ? "text-zinc-900 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-700 shadow"
                  : "text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800"
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
                      {users.length}
                    </span>
                  </div>
                </div>
                <div className="p-1 rounded-full group-hover:bg-zinc-300 dark:group-hover:bg-zinc-600 transition-colors duration-300">
                  <ChevronRightIcon
                    className={`h-6 w-6 text-zinc-700 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition duration-300 ${
                      open ? "rotate-90" : "rotate-0"
                    }`}
                  />
                </div>
              </div>
            </Disclosure.Button>
            <Disclosure.Panel as="ul">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="text-zinc-500 flex gap-1 items-center"
                >
                  <span className="inline-block">
                    <UserCircleIcon className="h-3 w-3" />
                  </span>
                  <span className="inline-block">{user.username}</span>
                </li>
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}

export default RoomItem;
