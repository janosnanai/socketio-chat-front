import { atom } from "jotai";

import { SidebarTabs } from "../constants";

const chatSelectorBaseAtom = atom(SidebarTabs.ROOMS);

export const chatSelectorGetterAtom = atom((get) => get(chatSelectorBaseAtom));

export const chatSelectorSetterAtom = atom(
  null,
  (_get, set, update: number) => {
    set(chatSelectorBaseAtom, update);
  }
);
