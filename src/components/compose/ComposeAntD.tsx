import React, { useEffect, useState } from 'react';
import { Button, Input, Layout, Space } from 'antd';
import { queryServer } from '../../utils/types/helper/helper';
import { userFromDb } from '../../models/user.models';
import { COLORS } from '../../constants/constants';
import { messageFromDb } from '../../models/message.models';
import { threadFromDb } from '../../models/thread.models';

const { TextArea } = Input;

interface Compose {
  otherUserEmail?: string;
  currentThreadId?: string;
  setUser: (user: userFromDb) => void;
  setMessages: (message: messageFromDb | messageFromDb[] | undefined) => void;
  setCurrentThreadId: (id: string) => void;
  setOtherUserEmail?: (email: string) => void;
  messages: messageFromDb[];
}

const App: React.FC<Compose> = ({
  otherUserEmail,
  currentThreadId,
  setUser,
  setMessages,
  setCurrentThreadId,
  setOtherUserEmail,
}) => {
  const [emailTo, setEmailTo] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailTitle, setEmailTitle] = useState('');
  // const { userTo } = useContext(threadContext);

  const [disabled, setDisabled] = useState(true);

  const sendEmail: () => void = () => {
    console.log(currentThreadId, 'zzz');
    setDisabled(true);
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
          console.log(JSON.stringify(res.data.user) + 'xxx');
          const newMessage: messageFromDb = res.data.message as messageFromDb;
          const thread = res.data.thread as threadFromDb;
          if (currentThreadId) {
            setMessages(newMessage);
          } else {
            setMessages([newMessage]);
          }
          if (currentThreadId !== thread._id) {
            console.log(`in if current == new message`);
            console.log(JSON.stringify(newMessage));
            console.log(thread._id);
            setCurrentThreadId(thread._id);
          }
          setUser(res.data.user as userFromDb);
          // setEmailTo(
          //   newMessage.from == res.data.user.email
          //     ? newMessage.to
          //     : newMessage.from
          // );
          // !otherUserEmail &&
          setOtherUserEmail &&
            setOtherUserEmail(
              newMessage.from == res.data.user.email
                ? newMessage.to
                : newMessage.from
            );
        }
      })
      .catch((err) => {
        console.log(err);
        setDisabled(false);
      });
  };
  useEffect(() => {
    // if (userTo) {
    otherUserEmail && setEmailTo(otherUserEmail);
    // }
  }, [otherUserEmail]);

  useEffect(() => {
    emailMessage && emailTitle && emailTo
      ? setDisabled(false)
      : setDisabled(true);
  }, [emailTo, emailMessage, emailTitle]);

  // useEffect(() => {
  //   if (messages[0]?.threadId != currentThreadId) {
  //     messages &&
  //       messages[0]?.threadId != currentThreadId &&
  //       setCurrentThreadId(messages[0]?.threadId);
  //   }
  // }, [messages, setCurrentThreadId]);

  return (
    <Layout className="bottom-0" style={{}}>
      <Space
        className="border-10 border-black h-full p-5"
        direction="vertical"
        size="large"
        style={{ backgroundColor: COLORS.base }}
      >
        {/* <> */}
        {/* {!otherUserEmail && ( */}
        {otherUserEmail ? (
          <div
            className="text-lg font-semibold"
            style={{ backgroundColor: COLORS.base, color: COLORS.primary }}
          >
            <h5>{`Continue conversation with: ${otherUserEmail}`}</h5>
            {/* <Button
              className="m-3"
              style={{ color: 'whitesmoke', backgroundColor: COLORS.secondary }}
              onClick={setOtherUserEmail}
            >
              Click to start a new thread
            </Button> */}
          </div>
        ) : (
          <div
            className="text-lg font-semibold"
            style={{ color: COLORS.primary }}
          >
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
