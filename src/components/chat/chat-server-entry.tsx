function ChatServerEntry(props: { msg: string; msgId?: string; key: string }) {
  return (
    <li>
      <div className="text-gray-500 text-sm px-1">
        <p>{props.msg}</p>
      </div>
    </li>
  );
}

export default ChatServerEntry;
