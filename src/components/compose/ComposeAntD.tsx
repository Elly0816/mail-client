import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Layout, Space } from 'antd';
import { queryServer } from '../../utils/types/helper/helper';
import { threadContext } from '../../pages/homepage/Homepage2';
import { userFromDb } from '../../models/user.models';
import { COLORS } from '../../constants/constants';

const { TextArea } = Input;

interface Compose {
  otherUserEmail?: string;
  currentThreadId?: string;
  setUser: (user: userFromDb) => void;
}

const App: React.FC<Compose> = ({
  otherUserEmail,
  currentThreadId,
  setUser,
}) => {
  const [emailTo, setEmailTo] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  // const { currentThreadId, userTo } = useContext(threadContext);

  const [disabled, setDisabled] = useState(true);

  const sendEmail: () => void = () => {
    setDisabled(true);
    console.log(
      JSON.stringify({
        title: emailTitle,
        body: emailMessage,
        to: emailTo,
        threadId: currentThreadId,
      })
    );
    queryServer({
      method: 'post',
      url: '/message',
      formdata: {
        title: emailTitle,
        body: emailMessage,
        to: emailTo,
        threadId: currentThreadId,
      },
    })
      .then((res) => {
        if (res.data) {
          setUser(res.data.user);
          !otherUserEmail && setEmailTo('');
          setEmailTitle('');
          setEmailMessage('');
          setDisabled(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setDisabled(false);
      });
  };
  useEffect(() => {
    otherUserEmail && setEmailTo(otherUserEmail);
  }, [otherUserEmail]);

  useEffect(() => {
    emailMessage && emailTitle && emailTo && setDisabled(false);
  }, [emailTo, emailMessage, emailTitle]);

  return (
    <Layout>
      <Space
        className="overflow-y h-auto border-10 border-black"
        direction="vertical"
        size="middle"
        // style={{ display: 'flex' }}
      >
        {/* <> */}
        {/* {!otherUserEmail && ( */}
        <TextArea
          placeholder="Email to: ..."
          onChange={(e) => setEmailTo(e.target.value)}
          value={emailTo}
          disabled={otherUserEmail ? true : false}
          style={{ height: '24px' }}
        />
        {/* )} */}

        <div style={{ margin: '24px 0' }} />
        <TextArea
          placeholder="Message Title: ..."
          // autoSize={{ minRows: 2, maxRows: 6 }}
          value={emailTitle}
          onChange={(e) => setEmailTitle(e.target.value)}
        />
        <div style={{ margin: '24px 0' }} />
        <div className="flex space-between">
          <TextArea
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
            placeholder="Message..."
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
          <Button
            onClick={() => {
              console.log('hey');
              sendEmail();
            }}
            disabled={disabled}
            style={{ backgroundColor: COLORS.secondary, color: 'white' }}
          >
            <p>Send</p>
          </Button>
        </div>
      </Space>

      {/* </> */}
    </Layout>
  );
};

export default App;
