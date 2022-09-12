import { useState } from "react";
import { useAtom } from "jotai";
import { Switch, Transition } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

import { darkModeGetterAtom, darkModeTogglerAtom } from "../../lib/atoms";

function DarkModeSwitch({ className }: { className?: string }) {
  const [darkModeEnabled] = useAtom(darkModeGetterAtom);
  const [, toggleDarkModeEnabled] = useAtom(darkModeTogglerAtom);
  const [prevIconVisible, setPrevIconVisible] = useState(false);

  return (
    <Switch
      checked={darkModeEnabled}
      onChange={toggleDarkModeEnabled}
      className={"h-6 w-6" + " " + className}
    >
      <Transition
        show={darkModeEnabled && !prevIconVisible}
        enter="transition duration-150 ease-out"
        enterFrom="opacity-0 -translate-y-3"
        enterTo="opacity-100 translate-y-0"
        beforeLeave={() => {
          setPrevIconVisible(true);
        }}
        leave="transition duration-150 ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-5"
        afterLeave={() => {
          setPrevIconVisible(false);
        }}
      >
        <MoonIcon />
      </Transition>
      <Transition
        show={!darkModeEnabled && !prevIconVisible}
        enter="transition duration-150 ease-out"
        enterFrom="opacity-0 -translate-y-3"
        enterTo="opacity-100 translate-y-0"
        beforeLeave={() => {
          setPrevIconVisible(true);
        }}
        leave="transition duration-150 ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-5"
        afterLeave={() => {
          setPrevIconVisible(false);
        }}
      >
        <SunIcon />
      </Transition>
    </Switch>
  );
}

export default DarkModeSwitch;
