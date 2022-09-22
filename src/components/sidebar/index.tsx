import { Tab } from "@headlessui/react";

import RoomsBar from "./rooms-bar";
import UsersBar from "./users-bar";

function SideBar() {
  return (
    <aside className="w-64 p-3 pt-1 bg-zinc-200 dark:bg-zinc-900 shadow-lg rounded-lg">
      <Tab.Group>
        <Tab.List className="flex">
          <Tab className="w-1/2 uppercase">rooms</Tab>
          <Tab className="w-1/2 uppercase">users</Tab>
        </Tab.List>
        <Tab.Panels>
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

export default SideBar;
