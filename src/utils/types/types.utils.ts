import { threadFromDb } from '../../models/thread.models';
import { userFromDb } from '../../models/user.models';

export interface message {
  title: string;
  body: string;
  from: string;
  to: string;
  threadId: string;
}

export interface user {
  email: string;
  password: string;
  //   messages: string [];
}

export interface threadInfoFromServer {
  message: threadFromDb[];
  user: Omit<userFromDb, 'password'>;
  unread: number[];
  otherUser: string[];
}
