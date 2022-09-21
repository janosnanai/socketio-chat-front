function ServerMessageBubble({ message }: { message: ServerMsg }) {
  return (
    <p className="text-xs px-4 text-zinc-500">{(message as ServerMsg).content}</p>
  );
}

export default ServerMessageBubble;
