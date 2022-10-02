const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS!;

export async function fetchRoomChat(roomId?: string): Promise<RoomChat | null> {
  if (!roomId) return Promise.resolve(null);
  const res = await fetch(`${SERVER_ADDRESS}/room-chats/${roomId}`);
  return res.json();
}

export async function fetchPrivateChat(
  users?: [string, string | null] | null
): Promise<PrivateChat | null> {
  if (!users) return Promise.resolve(null);
  const res = await fetch(
    `${SERVER_ADDRESS}/private-chats?user=${users[0]}&user=${users[1]}`
  );
  return res.json();
}
