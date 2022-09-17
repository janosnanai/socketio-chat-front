import { atom } from "jotai";

import socket from "../socket";

const socketConnectedBaseAtom = atom(false);

export const socketConnectedGetterAtom = atom((get) =>
  get(socketConnectedBaseAtom)
);

export const socketConnectedSetterAtom = atom(
  null,
  (_get, set, connected: boolean) => {
    set(socketConnectedBaseAtom, connected);
  }
);

export const socketAtom = atom(socket);
