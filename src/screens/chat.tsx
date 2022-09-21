import SideBar from "../components/sidebar";
import RoomChatWindow from "../components/chat-window/room-chat-window";
import MessageInput from "../components/chat-window/message-input";

function ChatScreen() {
  return (
    <div className="flex gap-5 justify-center pt-12">
      <SideBar />
      <div className="flex flex-col w-96 gap-2">
        <RoomChatWindow />
        <MessageInput />
      </div>
    </div>
  );
}

export default ChatScreen;
