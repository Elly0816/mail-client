import React, { useContext, createContext, useState, useEffect } from 'react';
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

const {
  // Header, Content, Footer,
  Sider,
} = Layout;

// const items: MenuProps['items'] = [
//   UserOutlined,
//   VideoCameraOutlined,
//   UploadOutlined,
//   BarChartOutlined,
//   CloudOutlined,
//   AppstoreOutlined,
//   TeamOutlined,
//   ShopOutlined,
// ].map((icon, index) => ({
//   key: String(index + 1),
//   icon: React.createElement(icon),
//   label: `nav ${index + 1}`,
// }));

interface ThreadContext {
  setThread?: (id: string) => void;
  currentThreadId?: string;
  userTo?: string;
  changeOtherUser?: (email: string) => void;
}

interface HomePage {
  setUnreadCount: () => void;
}

const App: React.FC<HomePage> = ({ setUnreadCount }) => {
  const { user, setUser, unreadCount, setAuth } = useContext(authContext);

  const [currentThreadId, setCurrentThreadId] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [userTo, setUserTo] = useState<string>();
  // const enterLoading = (index: number) => {
  //   setLoadings((prevLoadings) => {
  //     const newLoadings = [...prevLoadings];
  //     newLoadings[index] = true;
  //     return newLoadings;
  //   });
  // };

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

  return (
    <Layout className="flex flex-col h-max font-sans">
      <Layout className="h-fit">
        <div
          style={{
            backgroundColor: COLORS.base,
            color: COLORS.primary,
            borderColor: COLORS.primary,
          }}
          className="align-middle h-min flex p-5 flex-shrink font-bold text-lg justify-between border-y-2"
        >
          <Space className="w-full flex justify-evenly">
            <h4>{`Hi ${getNameFromUser(
              user?.email as string
            ).toLocaleUpperCase()}`}</h4>
            <h5>{`You have ${
              unreadCount && unreadCount.unread > 0 ? unreadCount.unread : 0
            } unread message${
              unreadCount && unreadCount.unread > 1 ? 's' : ''
            }`}</h5>
            {userTo && (
              <Button
                className="m-3"
                style={{
                  color: 'whitesmoke',
                  backgroundColor: COLORS.secondary,
                }}
                onClick={() => {
                  setUserTo(undefined);
                  setCurrentThreadId(undefined);
                }}
              >
                Click to start a new thread
              </Button>
            )}
            <Button
              type="primary"
              style={{ backgroundColor: COLORS.secondary }}
              icon={<PoweroffOutlined />}
              loading={loading}
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Button>
          </Space>
        </div>
      </Layout>
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
            padding: 0,
            // maxWidth: '25%',
          }}
          // width={'min-content'}
          // className="border-6"
        >
          {/* <div className="demo-logo-vertical" /> */}
          {/* <div className="h-5/6"> */}
          <threadContext.Provider
            value={{ currentThreadId, setThread, changeOtherUser }}
          >
            <ThreadList />
          </threadContext.Provider>
          {/* </div> */}
          {/* <div>Hey</div> */}
        </Sider>
        <Layout
          className="p-2 border-2"
          style={{ borderColor: COLORS.accent, backgroundColor: COLORS.base }}
        >
          {/* <div>Hi!</div> */}
          {/* <div className="flex flex-col h-full"> */}
          {/* <Space
            direction="vertical"
            size="small"
            style={{ display: 'flex' }}
            className="h-screen"
          > */}
          <Message id={currentThreadId} />
          <Compose
            setUser={refreshUser}
            otherUserEmail={userTo}
            currentThreadId={currentThreadId}
            // setOtherUserEmail={() => {
            //   setUserTo(undefined);
            //   setCurrentThreadId(undefined);
            // }}
          />
          {/* </Space> */}
          {/* </div> */}
        </Layout>
      </Layout>
    </Layout>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const threadContext = createContext<ThreadContext>({});
export default App;
