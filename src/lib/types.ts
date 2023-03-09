type Message = {
  userId: number;
  text: string;
  date: string;
};

type Canal = {
  id: number;
  title: string;
  messages: Message[];
};

type Group = {
  id: number;
  title: string;
  type: string;
  canals: Canal[];
};

type Server = {
  id: number;
  title: string;
  icon: string;
  users: User[];
  groups: Group[];
};

type User = {
  id: number;
  username: string;
  avatar: string;
  online: boolean;
};

export { Canal, Group, User, Server };