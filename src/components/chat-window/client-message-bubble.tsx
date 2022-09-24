function ClientMessageBubble({
  message,
  isOwn = false,
}: {
  message: ClientMsg;
  isOwn?: boolean;
}) {
  return (
    <div
      className={`bg-zinc-100 dark:bg-zinc-800 rounded-lg px-2 py-1 mx-4 my-2 relative after:absolute border ${
        isOwn
          ? "border-emerald-500 after:block after:h-3 after:w-3 after:-left-1.5 after:bottom-3 after:rotate-45 after:bg-zinc-100 after:dark:bg-zinc-800 after:border-b after:border-l after:border-emerald-500"
          : "border-purple-500 after:block after:h-3 after:w-3 after:-right-1.5 after:top-3 after:rotate-45 after:bg-zinc-100 after:dark:bg-zinc-800 after:border-t after:border-r after:border-purple-500"
      }`}
    >
      <div className="flex gap-2 items-center">
        <h4 className="text-sm text-cyan-700 dark:text-cyan-500">
          {message.author.username}
        </h4>
        <p className="text-xs font-mono text-zinc-500">{message.time}</p>
      </div>
      <div>
        <p className="text-zinc-700 dark:text-zinc-300">{message.content}</p>
      </div>
    </div>
  );
}

export default ClientMessageBubble;
