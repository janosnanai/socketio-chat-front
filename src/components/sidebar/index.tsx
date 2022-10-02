import { useAtom } from "jotai";
import { Tab } from "@headlessui/react";

import RoomsBar from "./rooms-bar";
import UsersBar from "./users-bar";
import { chatSelectorSetterAtom } from "../../lib/atoms";

function Sidebar() {
  const [, setChatWindow] = useAtom(chatSelectorSetterAtom);

  return (
    <aside className="w-64 flex flex-col gap-2">
      <Tab.Group onChange={(idx) => setChatWindow(idx)}>
        <Tab.List className="flex gap-2 h-9 bg-zinc-100/50 dark:bg-zinc-900/50 p-1 rounded-lg shadow-lg">
          <Tab
            className={({ selected }) =>
              `w-1/2 uppercase rounded-lg transition-colors ${
                selected
                  ? "bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-700 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 bg-transparent hover:bg-zinc-50/50 dark:hover:bg-zinc-700/50"
              }`
            }
          >
            rooms
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-1/2 uppercase rounded-lg transition-colors ${
                selected
                  ? "bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-700 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 bg-transparent hover:bg-zinc-50/50 dark:hover:bg-zinc-700/50"
              }`
            }
          >
            users
          </Tab>
        </Tab.List>
        <Tab.Panels className="flex-grow p-3 pt-1 bg-zinc-200 dark:bg-zinc-900 shadow-lg rounded-lg">
          <Tab.Panel>
            <RoomsBar />
          </Tab.Panel>
          <Tab.Panel>
            <UsersBar />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </aside>
  );
}

export default Sidebar;
