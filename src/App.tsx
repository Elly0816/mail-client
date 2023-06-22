import './App.css';
import HomePage from './pages/homepage/Homepage2';
import LoginPage from './pages/loginpage/loginPage';
import { useCallback, useEffect, useState } from 'react';
import { createContext } from 'react';
import { userFromDb } from './models/user.models';
import SignUpPage from './pages/signuppage/signupPage';
import { Layout, Spin, message } from 'antd';
import useFetch from './hooks/useFetch';
import { COLORS } from './constants/constants';

export interface authContextType {
  user?: userFromDb | undefined;
  auth?: boolean;
  setUser?: React.Dispatch<React.SetStateAction<userFromDb | undefined>>;
  setAuth?: React.Dispatch<React.SetStateAction<boolean>>;
  addUnread?: (unread: number) => void;
  unreadCount?: number;
}

export interface methContextType {
  meth: 'login' | 'signup';
  toggle: () => void;
}

function App() {
  const [user, setUser] = useState<userFromDb | undefined>();
  const [meth, setMeth] = useState<'login' | 'signup'>('signup');
  const [messageApi, contextHolder] = message.useMessage();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const successNotification = () => {
    messageApi.open({
      type: 'success',
      content: 'This is a success message',
    });
  };

  const errorNotification = () => {
    messageApi.open({
      type: 'error',
      content: 'This is an error message',
    });
  };

  const warningNotification = () => {
    messageApi.open({
      type: 'warning',
      content: 'This is a warning message',
    });
  };

  const [auth, setAuth] = useState<boolean>(false);

  const { data, error, loading } = useFetch({ method: 'get', path: '' });

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
      setAuth(false);
    }
  }, [data]);

  const addUnread: (unread: number) => void = (unread) => {
    setUnreadCount((unreadCount) => unreadCount + unread);
  };

  const main = (
    <authContext.Provider
      value={{ auth, user, setUser, setAuth, addUnread, unreadCount }}
    >
      {contextHolder}
      {auth ? (
        <HomePage />
      ) : (
        // <div>Hey!</div>
        <methContext.Provider value={{ meth, toggle }}>
          {contextHolder}
          <Layout
            className="py-7 h-screen"
            style={{ backgroundColor: COLORS.primary }}
          >
            {meth == 'login' ? <LoginPage /> : <SignUpPage />}
          </Layout>
        </methContext.Provider>
      )}
    </authContext.Provider>
  );

  const child = loading ? (
    <Layout>
      <div className="h-screen p-auto">
        <Spin />
      </div>
    </Layout>
  ) : (
    main
  );

  return (
    <authContext.Provider value={{ auth, user, setUser, setAuth }}>
      {contextHolder}
      {child}
    </authContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext<authContextType>({});
// export {authContext};
// eslint-disable-next-line react-refresh/only-export-components
export const methContext = createContext<methContextType | undefined>(
  undefined
);
export default App;
