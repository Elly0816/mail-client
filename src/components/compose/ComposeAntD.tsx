import React, { useEffect, useState } from 'react';
import { Button, Input, Layout, Space } from 'antd';
import { queryServer } from '../../utils/types/helper/helper';
import { userFromDb } from '../../models/user.models';
import { COLORS } from '../../constants/constants';

const { TextArea } = Input;

interface Compose {
  otherUserEmail?: string;
  currentThreadId?: string;
  setUser: (user: userFromDb) => void;
  setOtherUserEmail?: () => void;
}

const App: React.FC<Compose> = ({
  otherUserEmail,
  currentThreadId,
  setUser,
  setOtherUserEmail,
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
    <Layout className="bottom-0" style={{ height: '40%' }}>
      <Space
        className="border-10 border-black h-fit"
        direction="vertical"
        size="large"
        // style={{ display: 'flex' }}
      >
        {/* <> */}
        {/* {!otherUserEmail && ( */}
        {otherUserEmail ? (
          <div className="text-lg">
            <h5>{`Continue conversation with: ${otherUserEmail}`}</h5>
            <Button
              className="m-3"
              style={{ color: 'whitesmoke', backgroundColor: COLORS.secondary }}
              onClick={setOtherUserEmail}
            >
              Click to start a new thread
            </Button>
          </div>
        ) : (
          <div className="text-lg">
            <h5>{`Start a new Thread`}</h5>
          </div>
        )}
        <TextArea
          placeholder="Email to: ..."
          onChange={(e) => setEmailTo(e.target.value)}
          value={emailTo}
          disabled={otherUserEmail ? true : false}
          style={{ height: '10px' }}
        />
        {/* )} */}

        {/* <div style={{ margin: '10px 0' }} /> */}
        <TextArea
          placeholder="Message Title: ..."
          // autoSize={{ minRows: 2, maxRows: 6 }}
          value={emailTitle}
          onChange={(e) => setEmailTitle(e.target.value)}
          style={{ height: '10px' }}
        />
        {/* <div style={{ margin: '10px 0' }} /> */}
        <div className="flex space-between w-full items-center justify-evenly">
          {/* <Space
            align="center"
            size={'large'}
            className="flex space-around overflow-y w-fit"
          > */}
          <TextArea
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
            placeholder="Message..."
            autoSize={{ maxRows: 4, minRows: 3 }}
            className="w-10/12 h-fit"
          />
          <Button
            onClick={() => {
              console.log('hey');
              sendEmail();
            }}
            disabled={disabled}
            style={{ backgroundColor: COLORS.secondary, color: 'white' }}
            className="rounded-full "
          >
            Send
          </Button>
          {/* </Space> */}
        </div>
      </Space>

      {/* </> */}
    </Layout>
  );
};

export default App;
