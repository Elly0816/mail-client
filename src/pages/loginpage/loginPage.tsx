import {
  // useContext,
  //  useEffect,
  useState,
} from 'react';
import LoginForm from '../../components/loginForm/loginAntDform';
import React from 'react';
import './loginPage.css';
// import { authContext } from '../../App';
// import { useNavigate } from 'react-router-dom';
// import Loading from '../../components/loading/Loading';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface loginPageProps {}

const LoginPage: React.FC<loginPageProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="items-center flex flex-col justify-center max-w-none mt-20 p-10 rounded-lg border-5 border-black-100">
      <h1 className="font-semibold">Login</h1>
      <LoginForm loading={loading} setLoading={setLoading} />
    </div>
  );
};

export default LoginPage;
