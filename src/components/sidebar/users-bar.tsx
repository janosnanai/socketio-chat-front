import { useAtom } from "jotai";
import { RadioGroup } from "@headlessui/react";

import UserItem from "./user-item";
import {
  targetUserGetterAtom,
  targetUserSetterAtom,
  thisUserGetterAtom,
  usersGetterAtom,
  usersTypingPrivateGetterAtom,
} from "../../lib/atoms";

function UsersBar() {
  const [targetUser] = useAtom(targetUserGetterAtom);
  const [, setTargetUser] = useAtom(targetUserSetterAtom);
  const [thisUser] = useAtom(thisUserGetterAtom);
  const [users] = useAtom(usersGetterAtom);
  const [usersTypingPrivate] = useAtom(usersTypingPrivateGetterAtom);

  function changeTargetUserHandler(selectedUser: User | null) {
    if (!selectedUser) return;
    setTargetUser(selectedUser);
  }

  return (
    <RadioGroup value={targetUser} onChange={changeTargetUserHandler}>
      {users
        .filter((user) => {
          return user.id !== thisUser.id;
        })
        .map((user) => {
          const isTyping = usersTypingPrivate.includes(user.id);
          return (
            <RadioGroup.Option key={user.id} value={user}>
              {({ checked }) => (
                <UserItem
                  user={user}
                  selected={checked}
                  online
                  typing={isTyping}
                />
              )}
            </RadioGroup.Option>
          );
        })}
    </RadioGroup>
  );
}

export default UsersBar;
