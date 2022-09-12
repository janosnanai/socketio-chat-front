import { atom } from "jotai";

const darkModeBaseAtom = atom(false);

export const darkModeGetterAtom = atom((get) => get(darkModeBaseAtom));

export const darkModeTogglerAtom = atom(null, (get, set) => {
  const prev = get(darkModeBaseAtom);
  set(darkModeBaseAtom, !prev);
  document.getElementById("app-root")?.classList.toggle("dark");
});
