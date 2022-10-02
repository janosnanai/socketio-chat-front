import { useAtom } from "jotai";

import UserItem from "./user-item";
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
          return (
            <li key={user.id}>
              <UserItem user={user} online typing/>
            </li>
          );
        })}
    </ul>
  );
}

export default UsersBar;
