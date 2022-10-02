import { useAtom } from "jotai";

import RoomChatWindow from "./room-chat-window";
import PrivateChatWindow from "./private-chat-window";

import { chatSelectorGetterAtom } from "../../lib/atoms";
import { SidebarTabs } from "../../lib/constants";

function ChatWindow() {
  const [selectedChat] = useAtom(chatSelectorGetterAtom);

  return (
    <>
      {selectedChat === SidebarTabs.ROOMS && <RoomChatWindow />}
      {selectedChat === SidebarTabs.USERS && <PrivateChatWindow />}
    </>
  );
}

export default ChatWindow;
