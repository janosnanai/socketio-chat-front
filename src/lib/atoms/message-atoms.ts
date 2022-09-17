import { atom } from "jotai";

const messagesBaseAtom = atom<(ClientMsg | ServerMsg)[]>([]);

export const messagesGetterAtom = atom((get) => get(messagesBaseAtom));

export const messagesSetterAtom = atom(
  null,
  (get, set, newMessage: ClientMsg | ServerMsg) => {
    const prev = get(messagesBaseAtom);
    set(messagesBaseAtom, [...prev, newMessage]);
  }
);
