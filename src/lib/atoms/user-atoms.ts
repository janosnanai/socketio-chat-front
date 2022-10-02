import { atom } from "jotai";

import { UsersTypingPrivateActionTypes } from "../constants";

// this user
const thisUserBaseAtom = atom<UserCore>({ username: "anonymus" });

export const thisUserGetterAtom = atom((get) => get(thisUserBaseAtom));

export const thisUserSetterAtom = atom(
  null,
  (_get, set, newThisUser: UserCore) => set(thisUserBaseAtom, newThisUser)
);

// private chat target user
const targetUserBaseAtom = atom<User | null>(null);

export const targetUserGetterAtom = atom((get) => get(targetUserBaseAtom));

export const targetUserSetterAtom = atom(
  null,
  (_get, set, update: User | null) => set(targetUserBaseAtom, update)
);

// all users
const usersBaseAtom = atom<User[]>([]);

export const usersGetterAtom = atom((get) => get(usersBaseAtom));

export const usersSetterAtom = atom(null, (_get, set, newUsers: User[]) =>
  set(usersBaseAtom, newUsers)
);

// users typing in private
const usersTypingPrivateBaseAtom = atom<string[]>([]);

export const usersTypingPrivateGetterAtom = atom((get) =>
  get(usersTypingPrivateBaseAtom)
);

const usersTypingPrivateSetterAtom = atom(null, (_get, set, update: string[]) =>
  set(usersTypingPrivateBaseAtom, update)
);

export const usersTypingPrivateDispatchAtom = atom(
  null,
  (get, set, action: { type: number; payload: string }) => {
    const prev = get(usersTypingPrivateGetterAtom);
    switch (action.type) {
      case UsersTypingPrivateActionTypes.ADD_USER:
        if (prev.includes(action.payload)) return;
        set(usersTypingPrivateSetterAtom, [...prev, action.payload]);
        break;
      case UsersTypingPrivateActionTypes.REMOVE_USER:
        const idx = prev.findIndex((userId) => action.payload === userId);
        if (idx < 0 || !prev.length) return;
        const update = [...prev];
        update.splice(idx, 1);
        set(usersTypingPrivateSetterAtom, update);
        break;
      case UsersTypingPrivateActionTypes.RESET:
        set(usersTypingPrivateSetterAtom, []);
        break;
      default:
        throw new Error("unknown action type");
    }
  }
);
