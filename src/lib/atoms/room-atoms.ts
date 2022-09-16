import { atom } from "jotai";

const roomsBaseAtom = atom<Room[]>([]);

export const roomsGetterAtom = atom((get) => get(roomsBaseAtom));

export const roomsSetterAtom = atom(null, (_get, set, newRooms: Room[]) => {
  set(roomsBaseAtom, newRooms);
});

const currentRoomBaseAtom = atom<Room | null>(null);

export const currentRoomGetterAtom = atom((get) => get(currentRoomBaseAtom));

export const currentRoomSetterAtom = atom(
  null,
  (_get, set, selectedRoom: Room | null) => {
    set(currentRoomBaseAtom, selectedRoom);
  }
);
