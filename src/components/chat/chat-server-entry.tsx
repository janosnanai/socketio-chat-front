function ChatServerEntry(props: { msg: string }) {
  return (
    <div className="w-72 mx-auto">
      <div>
        <span>{props.msg}</span>
      </div>
    </div>
  );
}

export default ChatServerEntry;
