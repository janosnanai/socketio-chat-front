function ChatUserEntry(props: { msg: string; type: string }) {
  return (
    <div className="w-72">
      <div className="inline-block px-4 py-1 bg-zinc-700 rounded-3xl rounded-bl-none">
        <span>{`${props.type}: ${props.msg}`}</span>
      </div>
    </div>
  );
}

export default ChatUserEntry;
