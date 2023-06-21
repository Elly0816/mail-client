import './App.css';
import {
  RouterProvider,
  createBrowserRouter,
  matchRoutes,
} from 'react-router-dom';
import HomePage from './pages/homepage/homepage';
import LoginPage from './pages/loginpage/loginPage';
import { useState } from 'react';
import { createContext } from 'react';
import { userFromDb } from './models/user.models';
import SignUpPage from './pages/signuppage/signupPage';
import MessagePage from './pages/messagepage/messagePage';
import Layout from './layout/Layout';
import Loading from './components/loading/Loading';

const router = createBrowserRouter([
  {
    children: [
      {
        path: '/',
        element: (
          <Layout>
            <HomePage />
          </Layout>
        ),
      },
      {
        path: '/login',
        element: (
          <Layout>
            <LoginPage />
          </Layout>
        ),
      },
      {
        path: '/signup',
        element: (
          <Layout>
            <SignUpPage />
          </Layout>
        ),
      },
      {
        path: '/message/:id',
        element: (
          <Layout>
            <MessagePage match={matchRoutes} location={location} />{' '}
          </Layout>
        ),
      },
    ],
  },
]);

export interface authContextType {
  user?: userFromDb | undefined;
  auth?: boolean;
  setUser?: React.Dispatch<React.SetStateAction<userFromDb | undefined>>;
  setAuth?: React.Dispatch<React.SetStateAction<boolean>>;
}

function App() {
  const [user, setUser] = useState<userFromDb | undefined>();

  const [auth, setAuth] = useState<boolean>(false);

  return (
    <authContext.Provider value={{ auth, user, setUser, setAuth }}>
      <RouterProvider
        router={router}
        future={{ v7_startTransition: true }}
        fallbackElement={<Loading />}
      />
    </authContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext<authContextType>({});
// export {authContext};

export default App;
