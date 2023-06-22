import {
  // useContext,
  //  useEffect,
  useState,
} from 'react';
import LoginForm from '../../components/loginForm/loginAntDform';
import React from 'react';
import './LoginPage.css';
// import { authContext } from '../../App';
// import { useNavigate } from 'react-router-dom';
// import Loading from '../../components/loading/Loading';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface loginPageProps {}

const LoginPage: React.FC<loginPageProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="w-2/6 m-auto mt-20 p-10 bg-slate-300 rounded-lg">
      <LoginForm loading={loading} setLoading={setLoading} />
    </div>
  );
};

export default LoginPage;
