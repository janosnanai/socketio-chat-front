import { useAtom } from "jotai";

import { thisUserGetterAtom, usersGetterAtom } from "../../lib/atoms";

function UsersBar() {
  const [thisUser] = useAtom(thisUserGetterAtom);
  const [users] = useAtom(usersGetterAtom);
  return (
    <ul>
      {users
        .filter((user) => {
          return user.id !== thisUser.id;
        })
        .map((user) => {
          return <li key={user.id}>{user.username}</li>;
        })}
    </ul>
  );
}

export default UsersBar;
