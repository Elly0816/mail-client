import { useState } from 'react';
import SignUpForm from '../../components/signupForm/signupformAntD';
import React from 'react';
import './signupPage.css';
import { COLORS } from '../../constants/constants';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface loginPageProps {}

const SignUpPage: React.FC<loginPageProps> = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // return !loading ? (
  return (
    <div className="items-center flex flex-col h-screen justify-center p-10 rounded-lg border-5 border-black-100">
      {/* <div className="w-4/6 m-auto mt-20 p-10 bg-slate-300 rounded-lg"> */}
      <h1 style={{ color: COLORS.primary }} className="font-semibold">
        SignUp
      </h1>
      <SignUpForm loading={loading} setLoading={setLoading} />
    </div>
  );

  // )
  // : (
  // <Loading />
  // );
};

export default SignUpPage;
