import {
  //  useContext,
  //   Fragment,
  //    useEffect,
  useState,
  // useMemo
} from 'react';
import SignUpForm from '../../components/signupForm/signupformAntD';
import React from 'react';
import './signupPage.css';
// import { authContext } from '../../App';
// import { useNavigate } from 'react-router-dom';
// import Loading from '../../components/loading/Loading';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface loginPageProps {}

const SignUpPage: React.FC<loginPageProps> = () => {
  // const { auth, user } = useContext(authContext);
  // useEffect(
  //   () => {
  //     if (user && auth) {
  //       navigate('/');
  //     }
  //   }
  //    [auth, navigate, user]
  // );
  const [loading, setLoading] = useState<boolean>(false);

  // return !loading ? (
  return (
    <div className="w-4/6 m-auto mt-20 p-10 bg-slate-300 rounded-lg">
      <SignUpForm loading={loading} setLoading={setLoading} />;
    </div>
  );

  // )
  // : (
  // <Loading />
  // );
};

export default SignUpPage;
