import { useAtom } from "jotai";

import { usersGetterAtom } from "../../lib/atoms";

function UsersPopover() {
  const [users] = useAtom(usersGetterAtom);
  return (
    <aside>
      <h2 className="uppercase text-xl text-zinc-900 dark:text-zinc-300">
        users
      </h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <p className="text-zinc-800 dark:text-zinc-200">{user.username}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default UsersPopover;
