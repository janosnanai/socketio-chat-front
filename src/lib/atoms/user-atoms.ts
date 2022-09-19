import { atom } from "jotai";

const thisUserBaseAtom = atom<UserCore>({ username: "anonymus" });

export const thisUserGetterAtom = atom((get) => get(thisUserBaseAtom));

export const thisUserSetterAtom = atom(
  null,
  (_get, set, newThisUser: UserCore) => {
    set(thisUserBaseAtom, newThisUser);
  }
);

const usersBaseAtom = atom<User[]>([]);

export const usersGetterAtom = atom((get) => get(usersBaseAtom));

export const usersSetterAtom = atom(null, (_get, set, newUsers: User[]) =>
  set(usersBaseAtom, newUsers)
);

const usersTypingBaseAtom = atom(false);

export const usersTypingGetterAtom = atom((get) => get(usersTypingBaseAtom));

export const usersTypingSetterAtom = atom(
  null,
  (_get, set, isTyping: boolean) => {
    set(usersTypingBaseAtom, isTyping);
  }
);
