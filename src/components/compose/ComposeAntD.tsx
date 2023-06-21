import { Button, Form, Input } from 'antd';
import React, { useContext } from 'react';
import { UseFetchProps } from '../../hooks/useFetch';
import { authContext } from '../../App';
import { queryServer } from '../../utils/types/helper/helper';

const { TextArea } = Input;

export interface composeInterface {
  method: UseFetchProps['method'];
  threadId?: string;
  to?: string;
  title: string;
  // message:{from:string, to:string, message:string, threadId?:string|undefined}
}

interface Inputs {
  to: string;
  title: string;
  body: string;
}

const Compose: React.FC<composeInterface> = ({
  method,
  threadId,
  to,
  title,
}) => {
  const { setUser, user } = useContext(authContext);
  const [form] = Form.useForm();

  const onFinish = (data: Inputs) => {
    const config = {
      formdata: {
        message: {
          to: to ? to : data.to,
          title: data.title,
          body: data.body,
          threadId: threadId,
        },
      },
      method: method as string,
      url: '/message',
    };
    console.log(config);

    queryServer(config)
      .then((res) => {
        setUser && setUser(res.data.user);
        console.log('xxx' + JSON.stringify(res));
        form.resetFields();
      })
      .catch((e) => {
        console.log(e);
      });

    console.log('Success:', data);
  };

  return (
    <div className="m-auto w-4/6 mt-20 p-10 bg-slate-300 rounded-lg">
      <div>
        <h2>{title}</h2>
      </div>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        // disabled={componentDisabled}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
      >
        {!to && (
          <Form.Item name="to" label="Email to">
            <Input placeholder="Sender Address" />
          </Form.Item>
        )}
        <Form.Item label="Title" name="title">
          <Input placeholder="Message Title" />
        </Form.Item>

        <Form.Item label="TextArea" name="body">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Send
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Compose;
