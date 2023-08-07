import { Button, Form, Input } from 'antd';
import React, { useContext } from 'react';
import {
  authContext,
  authContextType,
  notificationContext,
  notificationContextType,
} from '../../contexts/contexts';
import { userFromDb } from '../../models/user.models';
import { queryServer } from '../../utils/types/helper/helper';
import { AxiosError } from 'axios';
import { COLORS } from '../../constants/constants';
import { Link, useNavigate } from 'react-router-dom';

type Inputs = {
  email: string;
  password: string;
};

export interface loginFormInput {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const SignUpForm: React.FC = () => {
  const { setAuth, setUser } = useContext(authContext) as authContextType;
  const { signingUp, loginInstead } = useContext(
    notificationContext
  ) as notificationContextType;
  const navigate = useNavigate();

  const [form] = Form.useForm();

  // const { toggle } = useContext(methContext) as methContextType;

  const onFinish = (values: Inputs) => {
    // setLoading(true);
    signingUp();
    queryServer({
      formdata: { email: values.email, password: values.password },
      method: 'post',
      url: '/signup',
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
        navigate('/');
      })
      .catch((e: AxiosError) => {
        if (e.response?.status === 403) {
          navigate('/login');
          loginInstead();
        }
        setAuth && setAuth(false);
        console.log(e);
      });
    // navigate('');
    // setLoading(false);
    console.log('Success:', values);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      scrollToFirstError
      className="shadow-2xl rounded-md p-5 w-full border-2"
    >
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('The new password that you entered do not match!')
              );
            },
          }),
        ]}
      >
        <Input.Password placeholder="confirm password" />
      </Form.Item>
      {/* <Form.Item className="flex flex-col justify-self-center align-middle m-0">
      </Form.Item> */}
      <div className="w-full m-0 flex flex-col items-center">
        <Button
          style={{ backgroundColor: COLORS.secondary }}
          type="primary"
          htmlType="submit"
          className="login-form-button w-min"
        >
          Register
        </Button>
        {'     '}
        <div
          style={{ color: COLORS.secondary }}
          // type="primary"
          className="hover:cursor-pointer w-fit"
          // onClick={() => {
          //   navigate('/login');
          // }}
        >
          <Link to={'/login'}>Login Instead</Link>
        </div>
      </div>
    </Form>
  );
};

export default SignUpForm;
