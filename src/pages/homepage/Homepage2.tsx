import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  CSSProperties,
} from 'react';
import CachedIcon from '@mui/icons-material/Cached';
// import {
//   AppstoreOutlined,
//   BarChartOutlined,
//   CloudOutlined,
//   ShopOutlined,
//   TeamOutlined,
//   UploadOutlined,
//   UserOutlined,
//   VideoCameraOutlined,
// } from '@ant-design/icons';
// import type { MenuProps } from 'antd';
import {
  Layout,
  Space,
  Spin,
  //  Menu, theme
} from 'antd';
// import useFetch from '../../hooks/useFetch';
import { PoweroffOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import ThreadList from '../../components/thread/threadList';
import Compose from '../../components/compose/ComposeAntD';
import Message from '../../components/message/Message';
import { authContext } from '../../App';
import { getNameFromUser, queryServer } from '../../utils/types/helper/helper';
import { userFromDb } from '../../models/user.models';
import { COLORS } from '../../constants/constants';
import { messageFromDb } from '../../models/message.models';
import useWindowWide from '../../hooks/useWindowWidth';

const { Sider } = Layout;

interface ThreadContext {
  setThread?: (id: string) => void;
  currentThreadId?: string;
  userTo?: string;
  changeOtherUser?: (email: string) => void;
  messages?: messageFromDb[];
  setMessages?: (message?: undefined | messageFromDb[] | messageFromDb) => void;
}

interface HomePage {
  setUnreadCount: () => void;
  setMessages: (message?: messageFromDb[] | messageFromDb | undefined) => void;
  messages: messageFromDb[];
}

const App: React.FC<HomePage> = ({ setMessages, messages, setUnreadCount }) => {
  const { user, setUser, unreadCount, setAuth } = useContext(authContext);

  const [currentThreadId, setCurrentThreadId] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [userTo, setUserTo] = useState<string>();

  useEffect(() => {
    setUnreadCount();
  }, []);

  const setThread: (id: string) => void = (id) => {
    setCurrentThreadId(id);
  };

  const changeOtherUser: (email: string) => void = (email) => {
    setUserTo(email);
  };

  const refreshUser: (user: userFromDb) => void = (user) => {
    setUser && setUser(user as userFromDb);
  };

  const logout: () => void = () => {
    setLoading(true);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setAuth && setAuth(false);
    setUser && setUser(undefined);
    setMessages(undefined);
    queryServer({ method: 'post', url: '/logout', formdata: null })
      .then((res) => {
        console.log('+++' + JSON.stringify(res));
        if (res.status === 200) {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const refreshPage: () => void = () => {
    setLoading(true);
    queryServer({ method: 'get', formdata: null, url: '/' })
      .then((res) => {
        if (res.data.user) {
          setUser && setUser(res.data.user);
        }
      })
      .catch((err) => {
        if (!(err?.name.toLowerCase() === 'canceledError'.toLowerCase())) {
          setAuth && setAuth(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const wide = useWindowWide(600);
  // const newThread: MutableRefObject<HTMLElement | undefined> | undefined =
  //   useRef();

  const borderStyle: CSSProperties = {
    borderColor: COLORS.accent,
    borderStyle: 'solid',
    borderTopWidth: 3,
  };

  return (
    <Layout className="flex flex-col h-full">
      <Layout style={{ height: 80, maxHeight: 80 }}>
        {/* <div
          style={{
            backgroundColor: COLORS.base,
            ...borderStyle,
          }}
          className="align-middle h-min flex p-5 flex-shrink font-bold text-lg justify-around border-y-2"
        > */}
        <Space
          className="align-middle flex p-5 flex-shrink font-bold text-lg justify-around"
          style={{
            backgroundColor: COLORS.base,
            color: COLORS.primary,
            borderColor: COLORS.accent,
          }}
        >
          <h4 style={{ fontStyle: 'italic' }}>{`Hi ${getNameFromUser(
            user?.email as string
          ).toLocaleUpperCase()}!`}</h4>
          {unreadCount && (
            <div className=" shadow-md p-1 bg-green-500 text-white rounded-2xl">
              {wide || !userTo ? (
                <h5>{`${
                  unreadCount && unreadCount.unread > 0 ? unreadCount.unread : 0
                } new message${
                  unreadCount && unreadCount.unread > 1 ? 's' : ''
                }`}</h5>
              ) : (
                <h5 className="text-white">
                  {unreadCount && unreadCount.unread}
                </h5>
              )}
            </div>
          )}
          {/* {userTo && ( */}
          <Button
            className="m-3"
            // ref={newThread as MutableRefObject<HTMLElement>}
            style={{
              color: 'whitesmoke',
              backgroundColor: COLORS.secondary,
              display: shouldDisplay(userTo as string),
            }}
            onClick={() => {
              setUserTo(undefined);
              setCurrentThreadId(undefined);
              setMessages();
            }}
          >
            Start New Thread
          </Button>
          {/* // )} */}

          <Button
            style={{ backgroundColor: COLORS.secondary, padding: 0 }}
            title="Refresh thread"
            onClick={refreshPage}
            icon={
              <CachedIcon
                className="hover:cursor-pointer"
                style={{
                  color: COLORS.base,
                  margin: 0,
                  // backgroundColor: COLORS.secondary,
                }}
              />
            }
          />
          {/* </Button> */}
          <Button
            type="primary"
            style={{ backgroundColor: COLORS.secondary }}
            icon={<PoweroffOutlined />}
            loading={loading}
            onClick={() => {
              logout();
            }}
          >
            {wide && 'Logout'}
          </Button>
        </Space>
        {/* </div> */}
      </Layout>
      {!loading ? (
        <Layout hasSider className="flex flex-col">
          <Sider
            width={'25vw'}
            style={{
              overflow: 'scroll',
              // scrollbarWidth: 'thin',
              // height: '100vh',
              // position: 'initial',
              left: 0,
              top: 0,
              bottom: 0,
              backgroundColor: COLORS.base,
              // borderColor: COLORS.primary,
              margin: 0,
              ...borderStyle,
              padding: 0,
              // maxWidth: '25%',
            }}
            // width={'min-content'}
            // className="border-6"
          >
            {/* <div className="demo-logo-vertical" /> */}
            {/* <div className="h-5/6"> */}
            <threadContext.Provider
              value={{
                currentThreadId,
                setThread,
                changeOtherUser,
                setMessages,
                messages,
              }}
            >
              <ThreadList />
            </threadContext.Provider>
            {/* </div> */}
            {/* <div>Hey</div> */}
          </Sider>
          <Layout
            className="p-2"
            style={{ backgroundColor: COLORS.base, ...borderStyle }}
          >
            {/* <div>Hi!</div> */}
            {/* <div className="flex flex-col h-full"> */}
            {/* <Space
              direction="vertical"
              size="small"
              style={{ display: 'flex' }}
              className="h-screen"
            > */}
            <Message
              id={currentThreadId}
              setMessages={setMessages}
              messages={messages}
            />
            <Compose
              setUser={refreshUser}
              otherUserEmail={userTo}
              currentThreadId={currentThreadId}
              setMessages={setMessages}
              setCurrentThreadId={setThread}
              setOtherUserEmail={changeOtherUser}
              messages={messages}
            />
            {/* </Space> */}
            {/* </div> */}
          </Layout>
        </Layout>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Spin />
        </div>
      )}
    </Layout>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const threadContext = createContext<ThreadContext>({});
export default App;

const shouldDisplay: (some: string) => string = (some) => {
  if (some) {
    return '';
  } else {
    return 'none';
  }
};
