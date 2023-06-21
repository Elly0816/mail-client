import { Button, Form, Input } from 'antd';
import React, { useContext } from 'react';
import { authContext, authContextType } from '../../App';
import { userFromDb } from '../../models/user.models';
import { queryServer } from '../../utils/types/helper/helper';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';

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

const SignUpForm: React.FC<loginFormInput> = ({ setLoading }) => {
  const { setAuth, setUser } = useContext(authContext) as authContextType;

  const [form] = Form.useForm();

  const onFinish = (values: Inputs) => {
    setLoading(true);

    queryServer({
      formdata: { email: values.email, password: values.password },
      method: 'post',
      url: '/signup',
    })
      .then((res) => {
        const { user } = res.data;
        console.log(res);
        if (user) {
          setUser && setUser(user as userFromDb);
          setAuth && setAuth(true);
        }
      })
      .catch((e: AxiosError) => {
        if (e.response?.status === 403) {
          //   navigate('/login');
        }
        setAuth && setAuth(false);
        console.log(e);
      });
    // navigate('');
    setLoading(false);
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
        <Input />
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
        <Input.Password />
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
        <Input.Password />
        <Form.Item />
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Register
          </Button>
          {'     '}
          <Link to="/login">Login now!</Link>
        </Form.Item>
      </Form.Item>
    </Form>
  );
};

export default SignUpForm;
