function ChatUserEntry(props: {
  msg: string;
  senderName: string;
  type: "own" | "server" | "other";
  msgId?: string;
  key: string;
}) {
  const MsgStyles = {
    own: {
      outer: "flex justify-start",
      inner1: "w-72 flex justify-start",
      inner2: "inline-block px-4 py-1 bg-zinc-700 rounded-3xl rounded-bl-none",
    },
    other: {
      outer: "flex justify-end",
      inner1: "w-72 flex justify-end",
      inner2: "inline-block px-4 py-1 bg-zinc-700 rounded-3xl rounded-br-none",
    },
    server: {
      outer: "flex justify-center",
      inner1: "w-72",
      inner2: "inline-block text-zinc-500 text-sm",
    },
  };

  let currentStyle;
  let textContent;

  switch (props.type) {
    case "own":
      currentStyle = MsgStyles.own;
      textContent = `${props.senderName}: ${props.msg}`;
      break;
    case "other":
      currentStyle = MsgStyles.other;
      textContent = `${props.senderName}: ${props.msg}`;
      break;
    case "server":
      currentStyle = MsgStyles.server;
      textContent = props.msg;
      break;
  }

  return (
    <li className={currentStyle.outer}>
      <div className={currentStyle.inner1}>
        <div className={currentStyle.inner2}>
          <span>{textContent}</span>
        </div>
      </div>
    </li>
  );
}

export default ChatUserEntry;
