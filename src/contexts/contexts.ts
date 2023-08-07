import { createContext } from 'react';
import { userFromDb } from '../models/user.models';
import { messageFromDb } from '../models/message.models';
import { threadFromDb } from '../models/thread.models';

export interface authContextType {
  user: userFromDb | undefined;
  auth: boolean;
  setUser: React.Dispatch<React.SetStateAction<userFromDb | undefined>>;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setShouldFetch?: React.Dispatch<React.SetStateAction<boolean>>;
  addUnread?: (threadId: string, unread: number) => void;
  removeUnread?: (locUnrea: number) => void;
  shouldFetch?: boolean;
  sessionExpired: () => void;
}

export interface methContextType {
  meth: 'login' | 'signup';
  toggle: () => void;
}

export interface ThreadContextType {
  unreadCount?: { threads: threadFromDb[]; unread: number[] };

  setUnreadCount?: React.Dispatch<
    React.SetStateAction<
      | {
          threads: threadFromDb[];
          unread: number[];
        }
      | undefined
    >
  >;
  shouldFetch: boolean;
  setShouldFetch: React.Dispatch<React.SetStateAction<boolean>>;
  otherUser?: string[];
  setOtherUser?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  setMessages?: (message?: undefined | messageFromDb[] | messageFromDb) => void;
}

export interface emailContextType {
  userTo: string | undefined;
  threadId: string | undefined;
  setThreadId: React.Dispatch<React.SetStateAction<string | undefined>>;
  messages: messageFromDb[] | [];
  setMessages: React.Dispatch<React.SetStateAction<messageFromDb[] | []>>;
  setUserTo: React.Dispatch<React.SetStateAction<string | undefined>>;

  setCantSend: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface drawerPropsType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface notificationContextType {
  fetchingInbox: () => void;
  sendingMessage: () => void;
  messageSent: () => void;
  sessionExpired: () => void;
  notSendButAuth: () => void;
  loginInstead: () => void;
  signUpInstead: () => void;
  logginIn: () => void;
  signingUp: () => void;
  wrongCredentials: () => void;
  destroy: () => void;
  loggingOut: () => void;
}

export const notificationContext = createContext<
  undefined | notificationContextType
>(undefined);

export const authContext = createContext<authContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const methContext = createContext<methContextType | undefined>(
  undefined
);

export const emailsContext = createContext<emailContextType | undefined>(
  undefined
);

export const threadContext = createContext<ThreadContextType | undefined>(
  undefined
);

export const drawerContext = createContext<drawerPropsType | undefined>(
  undefined
);
