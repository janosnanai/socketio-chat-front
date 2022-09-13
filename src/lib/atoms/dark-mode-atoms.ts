import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const darkModeBaseAtom = atomWithStorage("darkMode", false);

export const darkModeGetterAtom = atom((get) => get(darkModeBaseAtom));

export const darkModeTogglerAtom = atom(null, (get, set) => {
  const prev = get(darkModeBaseAtom);
  set(darkModeBaseAtom, !prev);
});
