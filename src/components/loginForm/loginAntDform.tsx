import React, { useContext } from 'react';
import { Button, Form, Input } from 'antd';
import { authContext, authContextType } from '../../App';
import { queryServer } from '../../utils/types/helper/helper';
import { userFromDb } from '../../models/user.models';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './loginForm.css';
import { Link } from 'react-router-dom';

type Inputs = {
  email: string;
  password: string;
};

export interface loginFormInput {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginForm: React.FC<loginFormInput> = ({ setLoading }) => {
  const { setAuth, setUser } = useContext(authContext) as authContextType;

  const onFinish = (values: Inputs) => {
    setLoading(true);

    queryServer({
      formdata: { email: values.email, password: values.password },
      method: 'post',
      url: '/login',
    })
      .then((res) => {
        const { user } = res.data;
        console.log(res);
        if (user) {
          setUser && setUser(user as userFromDb);
          setAuth && setAuth(true);
        }
      })
      .catch((e) => {
        setAuth && setAuth(false);
        console.log(e);
      });
    // navigate('');
    setLoading(false);

    console.log('Success:', values);
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
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
      {/* <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item> */}

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <Link to="/signup">Register Now!</Link>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
