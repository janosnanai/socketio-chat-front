import { useMemo } from "react";

function ChatUserEntry(props: {
  msg: string;
  senderName: string;
  msgId?: string;
  key: string;
}) {
  const date = useMemo(() => new Date().toLocaleString("en-US"), []);
  return (
    <li>
      <div className="px-1">
        <span className="text-gray-200 font-medium">{props.senderName}</span>
        <span className="ml-2 text-xs text-gray-400 font-light">{date}</span>
        <p className="text-gray-300 font-light">{props.msg}</p>
      </div>
    </li>
  );
}

export default ChatUserEntry;
