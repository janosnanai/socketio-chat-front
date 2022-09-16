import { atom } from "jotai";

const thisUserBaseAtom = atom<ThisUser>({ username: "anonymus" });

export const thisUserGetterAtom = atom((get) => get(thisUserBaseAtom));

export const thisUserSetterAtom = atom(
  null,
  (_get, set, newThisUser: ThisUser) => {
    set(thisUserBaseAtom, newThisUser);
  }
);

const usersBaseAtom = atom<User[]>([]);

export const usersGetterAtom = atom((get) => get(usersBaseAtom));

export const usersSetterAtom = atom(null, (_get, set, newUsers: User[]) =>
  set(usersBaseAtom, newUsers)
);
