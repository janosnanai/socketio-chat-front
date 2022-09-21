const SERVER_ADDRESS = import.meta.env.VITE_SERVER_ADDRESS!;

export async function fetchRoomChat(roomId?: string): Promise<RoomChat> {
  if (!roomId) return Promise.reject();
  const res = await fetch(`${SERVER_ADDRESS}/room-chats/${roomId}`);
  return res.json();
}
