type NewUserMsg = {
  username: string;
};
type CreateMsg = {
  content: string;
  author: string;
};
type ClientMsg = {
  type: number;
  content: string;
  id: string;
  author: string;
  time: string;
};
type ServerMsg = {
  type: number;
  content: string;
  id: string;
  time: string;
};
type TypingMsg = {
  isTyping: boolean;
};
type SyncUsersMsg = {
  users: User[];
};

type User = {
  id: string;
  username: string;
  typing: boolean;
};
