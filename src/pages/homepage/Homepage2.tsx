import React, { useContext, useEffect } from 'react';
import { Layout } from 'antd';
// import useFetch from '../../hooks/useFetch';
import {
  threadContext,
  authContext,
  authContextType,
  ThreadContextType,
} from '../../contexts/contexts';
import {
  getNameFromUser,
  getUnreadFromState,
} from '../../utils/types/helper/helper';
import { messageFromDb } from '../../models/message.models';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/navbar/Navbar';
import Compose from '../../components/compose/ComposeAntD';
import { Typography } from 'antd';
import { threadFromDb } from '../../models/thread.models';

interface HomePage {
  setUnreadCount?: () => void;
  setMessages?: (message?: messageFromDb[] | messageFromDb | undefined) => void;
  messages?: messageFromDb[];
}

const Homepage2: React.FC<HomePage> = () => {
  const { user, auth } = useContext(authContext) as authContextType;

  const { unreadCount, setShouldFetch } = useContext(
    threadContext
  ) as ThreadContextType;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) {
      console.log('user', user);
      console.log('auth', auth);
      navigate('/login');
    }
    if (!auth) {
      setShouldFetch(true);
    }
  }, [auth, user?._id, setShouldFetch, navigate, user]);

  useEffect(() => {
    console.log('Unread: ', unreadCount);
  }, [unreadCount]);

  const { Title } = Typography;

  return (
    <>
      <Layout className="h-screen flex bg-opacity-0">
        <Header
          h1={'HomePage'}
          message={'Send New Message'}
          url={'/inbox'}
          linkText={'InboxPage'}
          otherUrl={undefined}
          otherLinkText={undefined}
        />
        <div className="h-full flex-1">
          {user && (
            <Title>{`Welcome back ${getNameFromUser(
              user.email as string
            )}!`}</Title>
          )}
          <Title level={2}>
            {unreadCount &&
              `You have ${getUnreadFromState(
                unreadCount as { threads: threadFromDb[]; unread: number[] }
              )} Unread Messages!`}
          </Title>
        </div>
        <Compose />
      </Layout>
    </>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default Homepage2;

// const shouldDisplay: (some: string) => string = (some) => {
//   if (some) {
//     return '';
//   } else {
//     return 'none';
//   }
// };
