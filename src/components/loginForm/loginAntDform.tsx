import React, { useContext } from 'react';
import { Button, Form, Input } from 'antd';
import {
  authContext,
  authContextType,
  notificationContext,
  notificationContextType,
} from '../../contexts/contexts';
import { queryServer } from '../../utils/types/helper/helper';
import { userFromDb } from '../../models/user.models';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './loginForm.css';
import { COLORS } from '../../constants/constants';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

type Inputs = {
  email: string;
  password: string;
};

export interface loginFormInput {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginForm: React.FC = () => {
  const { setAuth, setUser } = useContext(authContext) as authContextType;
  const { signUpInstead, logginIn, destroy, wrongCredentials } = useContext(
    notificationContext
  ) as notificationContextType;

  const navigate = useNavigate();
  // const { toggle } = useContext(methContext) as methContextType;
  const onFinish = (values: Inputs) => {
    // setLoading(true);
    logginIn();
    queryServer({
      formdata: { email: values.email, password: values.password },
      method: 'post',
      url: '/login',
    })
      .then((res) => {
        const { user } = res.data;
        console.log(res);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          setUser && setUser(user as userFromDb);
          setAuth && setAuth(true);
        }
      })
      .then(() => {
        destroy();
        navigate('/');
      })
      .catch((e) => {
        destroy();
        setAuth && setAuth(false);
        console.log(e);
        if (isAxiosError(e)) {
          console.log('Axios error');
          const errorMessage = (
            e.response?.data.message as string
          ).toLowerCase();
          if (errorMessage.includes('not found')) {
            signUpInstead();
            navigate('/signup');
          } else if (errorMessage.includes('incorrect')) {
            wrongCredentials();
          }
        }
        // destroy();
      });
    // navigate('');
    // setLoading(false);

    console.log('Success:', values);
  };

  return (
    <Form
      name="normal_login"
      // className="login-form "
      className="shadow-2xl rounded-md p-5 border-2 flex flex-col w-fit"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      {/* <Form.Item className="m-auto"> */}
      <div className="w-full m-0 flex flex-col items-center">
        <Button
          style={{ backgroundColor: COLORS.secondary }}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Log in
        </Button>
        <div
          style={{ color: COLORS.secondary }}
          // type="primary"
          className="hover:cursor-pointer w-fit"
          // onClick={() => {
          //   navigate('/login');
          // }}
        >
          <Link to={'/signup'}>SignUp Instead</Link>
        </div>
      </div>
      {/* </Form.Item> */}
    </Form>
  );
};

export default LoginForm;
