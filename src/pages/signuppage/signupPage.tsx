import SignUpForm from '../../components/signupForm/signupformAntD';
import React from 'react';
import './signupPage.css';
import { COLORS } from '../../constants/constants';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
// export interface loginPageProps {}

const SignUpPage: React.FC = () => {
  // return !loading ? (
  return (
    <div className="items-center flex flex-col h-screen justify-center p-10 rounded-lg border-5 border-black-100">
      <h1 style={{ color: COLORS.primary }} className="font-semibold">
        SignUp
      </h1>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
