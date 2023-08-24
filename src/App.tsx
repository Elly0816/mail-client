import './App.css';
import HomePage from './pages/homepage/Homepage2';
import LoginPage from './pages/loginpage/loginPage';
import { useCallback, useEffect, useState } from 'react';
import {
  authContext,
  emailsContext,
  drawerContext,
  threadContext,
  notificationContext,
} from './contexts/contexts';
import { userFromDb } from './models/user.models';
import SignUpPage from './pages/signuppage/signupPage';
import {
  message,
  // message
} from 'antd';
import { messageFromDb } from './models/message.models';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WelcomePage from './pages/welcomePage/WelcomePage';
import { threadFromDb } from './models/thread.models';
import InboxPage from './pages/inboxpage/InboxPage';
import MessagePage from './pages/messagepage/Messages';
import { networkError, queryServer } from './utils/types/helper/helper';
import { isAxiosError } from 'axios';
// import { COLORS } from './constants/constants';

const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: '/homepage',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  { path: '/signup', element: <SignUpPage /> },
  {
    path: '/inbox',
    element: <InboxPage />,
  },
  { path: '/messages/:id', element: <MessagePage /> },
]);

function App() {
  const [user, setUser] = useState<userFromDb | undefined>(
    JSON.parse(localStorage.getItem('user') as string) as userFromDb
  );
  const [unreadCount, setUnreadCount] = useState<{
    threads: threadFromDb[];
    unread: number[];
  }>();

  const [otherUser, setOtherUser] = useState<string[]>();

  const [messages, setMessages] = useState<messageFromDb[]>([]);

  const [userTo, setUserTo] = useState<string | undefined>();

  const [auth, setAuth] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [threadId, setThreadId] = useState<string | undefined>();

  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [cantSend, setCantSend] = useState<boolean>(false);

  // const [reloading, setReloading] = useState<boolean>(false);
  const fetchingInbox = useCallback(() => {
    messageApi.destroy();
    messageApi.open({
      type: 'loading',
      content: 'Fetching Inbox',
      duration: 0,
    });
  }, [messageApi]);

  const sendingMessage = useCallback(() => {
    messageApi.open({
      type: 'loading',
      content: 'Sending Message',
      duration: 0,
    });
  }, [messageApi]);

  const messageSent = useCallback(() => {
    messageApi.destroy();
    messageApi.open({ type: 'success', content: 'Message Sent' });
  }, [messageApi]);

  const loggingOut = useCallback(() => {
    messageApi.open({
      type: 'loading',
      content: 'Logging Out',
      duration: 0,
    });
  }, [messageApi]);

  const sessionExpired = useCallback(() => {
    messageApi.destroy();
    messageApi.open({
      type: 'warning',
      content: 'Session Expired\nYou have been logged out',
    });
  }, [messageApi]);

  const destroy = useCallback(() => {
    messageApi.destroy();
  }, [messageApi]);

  const notSendButAuth = useCallback(() => {
    messageApi.destroy();
    messageApi.open({
      type: 'warning',
      content: 'There was an error sending the message',
    });
  }, [messageApi]);

  const loginInstead = useCallback(() => {
    messageApi.destroy();
    messageApi.open({
      type: 'warning',
      content: 'Login Instead',
    });
  }, [messageApi]);

  const signUpInstead = useCallback(() => {
    messageApi.destroy();
    messageApi.open({
      type: 'warning',
      content: 'SignUp Instead',
    });
  }, [messageApi]);

  const logginIn = useCallback(() => {
    messageApi.open({
      type: 'loading',
      content: 'Logging In',
      duration: 0,
    });
  }, [messageApi]);

  const signingUp = useCallback(() => {
    messageApi.open({
      type: 'loading',
      content: 'Signing Up',
      duration: 0,
    });
  }, [messageApi]);

  const wrongCredentials = useCallback(() => {
    messageApi.destroy();
    messageApi.open({
      type: 'warning',
      content: 'Make sure your email and password are correct',
    });
  }, [messageApi]);

  const noInternet = useCallback(() => {
    messageApi.destroy();
    messageApi.open({
      type: 'warning',
      content: 'You have no internet Connection'
    });
  }, [messageApi])

  useEffect(() => {
    let url = window.location.href;
    let timer:NodeJS.Timeout;
    const showCantSend = () => {
      while (!url.includes('login')) {
        console.log('session Expired and waiting');
        url = window.location.href;
        timer = setTimeout(showCantSend, 500)
        // showCantSend();
      }
      console.log('session Expired');
      sessionExpired();
    };
    if (cantSend) {
      showCantSend();
      setCantSend(false);
    }
    // setCantSend(false);
    return () => clearTimeout(timer)
  }, [cantSend, setCantSend, sessionExpired]);

  useEffect(() => {
    console.log('This is the user: ', user);
  }, [user]);

  useEffect(() => {
    if (shouldFetch) {
      // setReloading(true);
      if (user?._id) {
        fetchingInbox();
      }
      queryServer({
        method: 'get',
        url: `/thread/${user?._id}`,
        formdata: null,
      })
        .then((res) => {
          const data = res.data;
          const unread = data.unread as unknown as number[];
          // setUnread(unread);
          const threads = data.message as unknown as threadFromDb[];
          const otherUser = data.otherUser as unknown as string[];
          setOtherUser(otherUser);
          // setThreads(threads);
          setUnreadCount({ threads: threads, unread: unread });
          setUser(data.user);
          setAuth(true);
          messageApi.destroy();
        })
        .catch((error) => {
          if (isAxiosError(error)){
            console.log(error);
            console.log(isAxiosError(error))
            networkError(error, noInternet); 
          } else if (!(error?.name.toLowerCase() === 'canceledError'.toLowerCase())) {
            setAuth && setAuth(false);
            setUser && setUser(undefined);
            sessionExpired();
            window.location.href = '/login';
          }
        })
        .finally(() => {
          setShouldFetch(false);
          // setReloading(false);
        });
    }
  }, [
    setAuth,
    setUser,
    messages,
    user?._id,
    shouldFetch,
    setShouldFetch,
    fetchingInbox,
    messageApi,
    sessionExpired,
    noInternet
  ]);

  const main = (
    <authContext.Provider
      value={{
        auth,
        user,
        setUser,
        setAuth,
        sessionExpired,
        // addUnread,
        // removeUnread,
        // shouldFetch,
        // setShouldFetch,
      }}
    >
      <threadContext.Provider
        value={{
          setUnreadCount,
          unreadCount,
          otherUser,
          setOtherUser,
          shouldFetch,
          setShouldFetch,
        }}
      >
        <drawerContext.Provider value={{ isOpen, setIsOpen }}>
          <emailsContext.Provider
            value={{
              messages,
              userTo,
              threadId,
              setThreadId,
              setUserTo,
              setMessages,
              setCantSend,
            }}
          >
            <notificationContext.Provider
              value={{
                noInternet,
                loggingOut,
                fetchingInbox,
                sendingMessage,
                messageSent,
                sessionExpired,
                notSendButAuth,
                loginInstead,
                signUpInstead,
                logginIn,
                signingUp,
                wrongCredentials,
                destroy,
              }}
            >
              {contextHolder}
              <RouterProvider router={router} />
            </notificationContext.Provider>
          </emailsContext.Provider>
        </drawerContext.Provider>
      </threadContext.Provider>
    </authContext.Provider>
  );

  return main;
}

// eslint-disable-next-line react-refresh/only-export-components

export default App;
