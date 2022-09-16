export function generateRoomsWithUsers(
  rooms: Room[],
  users: User[]
): RoomsWithUsers {
  const roomsWithUsers = rooms.reduce(
    (prev: any, curr) => ({ ...prev, [curr.id]: [] }),
    {}
  );
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const roomId = user.roomId;
    if (!roomId) continue;
    if (!Object.hasOwn(roomsWithUsers, roomId)) continue;
    roomsWithUsers[roomId].push(user);
  }
  return roomsWithUsers;
}
