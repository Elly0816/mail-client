import React, { useContext, createContext, useState } from 'react';
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
import useLocalStorage from '../../hooks/useLocalStorage';

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

const App: React.FC = () => {
  const [, setAccess] = useLocalStorage({ name: 'access' });
  const [, setRefresh] = useLocalStorage({ name: 'refresh' });
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
    queryServer({ method: 'get', url: '/logout', formdata: null })
      .then(() => {
        setLoading(true);
        setAuth && setAuth(false);
        setAccess('');
        setRefresh('');
        setUser && setUser(undefined);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Layout className="flex flex-col h-screen font-sans">
      <Layout className="h-fit">
        <div
          style={{ backgroundColor: COLORS.primary }}
          className="flex p-10 flex-row font-mono text-2xl justify-between text-slate-50"
        >
          <h4>{`Hi ${getNameFromUser(
            user?.email as string
          ).toLocaleUpperCase()}`}</h4>
          <h5>{`You have ${
            unreadCount && unreadCount > 0 ? unreadCount : 0
          } unread messages`}</h5>
          <Button
            type="primary"
            style={{ backgroundColor: COLORS.secondary }}
            icon={<PoweroffOutlined />}
            loading={loading}
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </Layout>
      <Layout hasSider className="h-full">
        <Sider
          style={{
            overflow: 'auto',
            height: 'in-content',
            position: 'initial',
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'gray',
          }}
          width={'fit-content'}
          className="row-span-4 max-h-fit"
        >
          <div className="demo-logo-vertical" />
          <div className="h-5/6">
            <threadContext.Provider
              value={{ currentThreadId, setThread, changeOtherUser }}
            >
              <ThreadList />
            </threadContext.Provider>
          </div>
          {/* <div>Hey</div> */}
        </Sider>
        <Layout className="p-10 border-slate-500 border-2">
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
            setOtherUserEmail={() => {
              setUserTo(undefined);
              setCurrentThreadId(undefined);
            }}
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
