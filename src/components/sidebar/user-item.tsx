import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid";
import { BeatLoader } from "react-spinners";

function UserItem({
  user,
  online,
  selected = false,
  typing = false,
}: {
  user: User;
  online: boolean;
  selected?: boolean;
  typing?: boolean;
}) {
  return (
    <div
      className={`m-1 px-2 py-1 relative transition-colors duration-300 rounded-lg ${
        selected
          ? "text-zinc-900 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-700 shadow"
          : "text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800"
      }`}
    >
      <span
        className={`absolute mr-1 h-2 w-2 rounded-full top-1 left-1 ${
          online ? "bg-emerald-500" : "bg-neutral-600"
        }`}
      />
      <h3 className="w-44 ml-2 truncate">{user.username}</h3>

      <ChatBubbleLeftIcon className="h-4 w-4 absolute top-1 right-2" />
      <BeatLoader
        loading={typing}
        className="absolute bottom-0 right-1.5"
        color="#9936d6"
        size={3}
        speedMultiplier={0.8}
        // cssOverride={{ position: "absolute", bottom: "2px", right: "6px" }}
      />
    </div>
  );
}

export default UserItem;
