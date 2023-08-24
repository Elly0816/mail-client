import { useContext, useEffect, useState } from 'react';
import { Button, Drawer, Input, Layout, Space } from 'antd';
import { networkError, queryServer } from '../../utils/types/helper/helper';
import { userFromDb } from '../../models/user.models';
import { COLORS } from '../../constants/constants';
import { messageFromDb } from '../../models/message.models';
import { threadFromDb } from '../../models/thread.models';
import {
  emailsContext,
  drawerContext,
  drawerPropsType,
  emailContextType,
  authContextType,
  authContext,
  threadContext,
  ThreadContextType,
  notificationContext,
  notificationContextType,
} from '../../contexts/contexts';
import TextArea from 'antd/es/input/TextArea';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import CreateIcon from '@mui/icons-material/Create';
import Typography from '@mui/material/Typography';
import { isAxiosError } from 'axios';

const Compose: React.FC = () => {
  const { isOpen, setIsOpen } = useContext(drawerContext) as drawerPropsType;
  const { setUser } = useContext(authContext) as authContextType;

  const { sendingMessage, messageSent, notSendButAuth, noInternet } = useContext(
    notificationContext
  ) as notificationContextType;

  const { userTo, setUserTo, setMessages, threadId, setThreadId, setCantSend } =
    useContext(emailsContext) as emailContextType;

  const { setShouldFetch } = useContext(threadContext) as ThreadContextType;

  const onClose = () => {
    setIsOpen(!isOpen);
  };

  const [emailTo, setEmailTo] = useState<string | undefined>();
  const [emailMessage, setEmailMessage] = useState<string | undefined>();
  const [emailTitle, setEmailTitle] = useState<string | undefined>();
  const [disabled, setDisabled] = useState<boolean>(true);
  const navigate = useNavigate();
  const [changeToNew, setChangeToNew] = useState<boolean>(false);

  useEffect(() => {
    if (userTo && !changeToNew) {
      setEmailTo(userTo as string);
      setDisabled(false);
    } else {
      setEmailTo(undefined);
    }
  }, [userTo, setEmailTo, changeToNew]);

  useEffect(() => {
    if (emailTo && emailMessage && emailTitle) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [emailTo, emailMessage, emailTitle]);

  useEffect(() => {
    const currentURL = window.location.href;
    if (!currentURL.toLowerCase().includes('messages')) {
      setUserTo(undefined);
    }
  }, [setUserTo]);

  const sendEmail: () => void = () => {
    console.log(threadId, 'zzz');
    setDisabled(true);
    sendingMessage();
    queryServer({
      method: 'post',
      url: '/message',
      formdata: {
        title: emailTitle,
        body: emailMessage,
        to: emailTo,
        threadId: !changeToNew ? threadId : undefined,
      },
    })
      .then((res) => {
        if (res.data) {
          setUser(res.data.user);
          !setUserTo && setEmailTo('');
          setEmailTitle('');
          setEmailMessage('');
          setDisabled(false);
          console.log(JSON.stringify(res.data.user) + 'xxx');
          const newMessage: messageFromDb = res.data.message as messageFromDb;
          const thread = res.data.thread as threadFromDb;
          if (threadId) {
            setMessages((msgs) => [...msgs, newMessage]);
          } else {
            setMessages([newMessage]);
          }
          if (threadId !== thread._id) {
            console.log(`in if current == new message`);
            console.log(JSON.stringify(newMessage));
            console.log(thread._id);
            setThreadId(thread._id);
          }
          setUser(res.data.user as userFromDb);

          setUserTo &&
            setUserTo(
              newMessage.from == res.data.user.email
                ? newMessage.to
                : newMessage.from
            );
        }
        setIsOpen(!isOpen);
        messageSent();
        setShouldFetch && setShouldFetch(true);
      })
      .catch((err: Error) => {
        console.log(err);
        setDisabled(false);
        if (isAxiosError(err)){
          networkError(err, noInternet);
        }
        if (err.message.includes('401')) {
          navigate('/login');
          setCantSend(true);
        } else {
          notSendButAuth();
        }
      });
    // .finally(() => {
    // });
  };

  let title = 'Send a message';

  if (userTo) {
    title = title + ` to ${userTo}`;
  }

  const toNewUser = () => {
    // setUserTo(undefined);
    // setThreadId(undefined);
    // setEmailTo(undefined)
    setChangeToNew(!changeToNew);
  };

  return (
    <Drawer
      title={
        <div className="flex flex-row justify-between ">
          <div className="flex flex-row place-items-center">
            {/* <h3 className=""> */}
            {!changeToNew ? title : 'Send new Message'}
            {/* </h3> */}
          </div>
          {userTo && (
            <IconButton
              onClick={toNewUser}
              size="large"
              aria-label="account of current user"
              color="inherit"
            >
              <CreateIcon />
              <Typography>
                {!changeToNew ? `Send in new Thread` : `Send to ${userTo}`}
              </Typography>
            </IconButton>
          )}
        </div>
      }
      placement="bottom"
      width={500}
      onClose={onClose}
      open={isOpen}
      // extra={
      //   <Space>
      //     <Button onClick={onClose}>Cancel</Button>
      //     <Button type="primary" onClick={onClose}>
      //       OK
      //     </Button>
      //   </Space>
      // }
    >
      <Layout className="bottom-0" style={{}}>
        <Space
          className="border-10 border-black p-5"
          direction="vertical"
          size="large"
          style={{ backgroundColor: COLORS.base }}
        >
          <Input
            allowClear
            placeholder="Email to: ..."
            onChange={(e) => setEmailTo(e.target.value)}
            value={emailTo}
            disabled={!changeToNew ? (userTo ? true : false) : false}
            // style={{ height: '10px' }}
          />
          <Input
            allowClear
            placeholder="Message Title: ..."
            // autoSize={{ minRows: 2, maxRows: 6 }}
            value={emailTitle}
            onChange={(e) => setEmailTitle(e.target.value)}
            // style={{ height: '10px' }}
          />
          <div className="flex space-between w-full items-center justify-evenly">
            <TextArea
              value={emailMessage}
              allowClear
              onChange={(e) => setEmailMessage(e.target.value)}
              placeholder="Message..."
              autoSize={{ maxRows: 5, minRows: 3 }}
              className="w-10/12 h-full"
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
    </Drawer>
  );
};

export default Compose;
