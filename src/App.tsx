import './App.css';
import HomePage from './pages/homepage/Homepage2';
import LoginPage from './pages/loginpage/loginPage';
import { useCallback, useEffect, useState } from 'react';
import { createContext } from 'react';
import { userFromDb } from './models/user.models';
import SignUpPage from './pages/signuppage/signupPage';
import {
  Layout,
  Spin,
  // message
} from 'antd';
import useFetch from './hooks/useFetch';
import { messageFromDb } from './models/message.models';
// import { COLORS } from './constants/constants';

export interface authContextType {
  user?: userFromDb | undefined;
  auth?: boolean;
  setUser?: React.Dispatch<React.SetStateAction<userFromDb | undefined>>;
  setAuth?: React.Dispatch<React.SetStateAction<boolean>>;
  setShouldFetch?: React.Dispatch<React.SetStateAction<boolean>>;
  addUnread?: (threadId: string, unread: number) => void;
  unreadCount?: { threads: string[]; unread: number };
  removeUnread?: (locUnrea: number) => void;
  shouldFetch?: boolean;
}

export interface methContextType {
  meth: 'login' | 'signup';
  toggle: () => void;
}

function App() {
  const [user, setUser] = useState<userFromDb | undefined>();
  const [meth, setMeth] = useState<'login' | 'signup'>('signup');
  // const [messageApi, contextHolder] = message.useMessage();
  const [unreadCount, setUnreadCount] = useState<{
    threads: string[];
    unread: number;
  }>({ threads: [], unread: 0 });

  const [messages, setMessages] = useState<messageFromDb[]>([]);

  const [auth, setAuth] = useState<boolean>(false);

  const { data, error, loading } = useFetch({ method: 'get', path: '' });
  const [shouldFetch, setShouldFetch] = useState(false);

  const toggle = useCallback(() => {
    if (meth == 'login') {
      setMeth('signup');
    } else {
      setMeth('login');
    }
  }, [meth]);

  useEffect(() => {
    if (data) {
      setUser(data.user);
      setAuth(true);
    } else {
      if (!(error?.name.toLowerCase() === 'canceledError'.toLowerCase())) {
        setAuth(false);
      }
    }
  }, [data]);

  const addUnread: (threadId: string, locUnreadCount: number) => void = (
    threadId,
    locUnreadCount
  ) => {
    if (unreadCount.threads.includes(threadId)) {
      return;
    } else {
      setUnreadCount(({ threads, unread }) => {
        threads.push(threadId);
        unread += locUnreadCount;
        return { threads, unread };
      });
      // setUnreadCount(({ threads, unread }) => {
      //   if (threads.includes(threadId)) {
      //     return { threads, unread };
      //   } else {
      //     threads.push(threadId);
      //     unread += unreadCount;
      //     return { threads, unread };
      //   }
    }
  };

  const removeUnread: (locUnreadCount: number) => void = (locUnreadCount) => {
    setUnreadCount(({ threads, unread }) => {
      unread -= locUnreadCount;
      return { threads, unread };
    });
  };

  const changeMessages: (
    newMessages?: messageFromDb[] | messageFromDb | undefined
  ) => void = (newMessages?) => {
    const newData = newMessages;
    console.log('changing messages: ' + newData);
    if (newData) {
      if (Array.isArray(newData)) {
        setMessages(() => [...newData]);
      } else {
        setMessages((messages) => [...messages, newData]);
      }
    } else {
      setMessages([]);
    }
  };

  const main = (
    <authContext.Provider
      value={{
        auth,
        user,
        setUser,
        setAuth,
        addUnread,
        unreadCount,
        removeUnread,
        shouldFetch,
        setShouldFetch,
      }}
    >
      {/* {contextHolder} */}
      {auth ? (
        <HomePage
          setUnreadCount={() => {
            setUnreadCount({ threads: [], unread: 0 });
          }}
          messages={messages}
          setMessages={changeMessages}
        />
      ) : (
        // <div>Hey!</div>
        <methContext.Provider value={{ meth, toggle }}>
          {/* {contextHolder} */}
          <Layout
            className=""
            // style={{ backgroundColor: COLORS.base, color: COLORS.accent }}
          >
            {meth == 'login' ? <LoginPage /> : <SignUpPage />}
          </Layout>
        </methContext.Provider>
      )}
    </authContext.Provider>
  );

  const child = loading ? (
    <Layout>
      <div className="h-screen p-auto flex justify-center items-center">
        <Spin />
      </div>
    </Layout>
  ) : (
    main
  );

  return child;
  // <authContext.Provider value={{ auth, user, setUser, setAuth }}>
  // {/* {contextHolder} */}

  // </authContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext<authContextType>({});
// export {authContext};
// eslint-disable-next-line react-refresh/only-export-components
export const methContext = createContext<methContextType | undefined>(
  undefined
);
export default App;
