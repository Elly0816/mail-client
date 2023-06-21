import './App.css';
import HomePage from './pages/homepage/Homepage2';
import LoginPage from './pages/loginpage/loginPage';
import { useCallback, useState } from 'react';
import { createContext } from 'react';
import { userFromDb } from './models/user.models';
import SignUpPage from './pages/signuppage/signupPage';
import { Layout } from 'antd';

export interface authContextType {
  user?: userFromDb | undefined;
  auth?: boolean;
  setUser?: React.Dispatch<React.SetStateAction<userFromDb | undefined>>;
  setAuth?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface methContextType {
  meth: 'login' | 'signup';
  toggle: () => void;
}

function App() {
  const [user, setUser] = useState<userFromDb | undefined>();
  const [meth, setMeth] = useState<'login' | 'signup'>('signup');

  const [auth, setAuth] = useState<boolean>(false);

  const toggle = useCallback(() => {
    if (meth == 'login') {
      setMeth('signup');
    } else {
      setMeth('login');
    }
  }, [meth]);

  return (
    <authContext.Provider value={{ auth, user, setUser, setAuth }}>
      {auth ? (
        <HomePage />
      ) : (
        // <div>Hey!</div>
        <methContext.Provider value={{ meth, toggle }}>
          <Layout>{meth == 'login' ? <LoginPage /> : <SignUpPage />}</Layout>
        </methContext.Provider>
      )}
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
