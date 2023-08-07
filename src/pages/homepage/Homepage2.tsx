import React, { useContext, useEffect } from 'react';
import { Card } from 'antd';
// import useFetch from '../../hooks/useFetch';
import { Button } from 'antd';
import {
  threadContext,
  authContext,
  authContextType,
  ThreadContextType,
} from '../../contexts/contexts';
import { getNameFromUser } from '../../utils/types/helper/helper';
import { messageFromDb } from '../../models/message.models';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../constants/constants';
import Header from '../../components/navbar/Navbar';
import Compose from '../../components/compose/ComposeAntD';

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

  return (
    <>
      <Header
        h1={'HomePage'}
        message={'Send New Message'}
        url={'/inbox'}
        linkText={'InboxPage'}
        otherUrl={undefined}
        otherLinkText={undefined}
      />
      <Card
        title={
          <div className="text-5xl text-left font-black">
            {`Welcome back ${
              user?.email && getNameFromUser(user?.email as string)
            }!`}
          </div>
        }
        bordered={false}
        className="w-4/5 m-auto flex-row mt-20"
        style={{ backgroundColor: COLORS.base }}
      >
        <div className="text-2xl">
          <p>{`You have ${
            unreadCount?.unread && unreadCount.unread.length > 0
              ? unreadCount.unread.reduce((prev, curr) => prev + curr)
              : 'no'
          } Unread Messages`}</p>
          <Button
            type="primary"
            className="bg-blue-500"
            onClick={() => {
              navigate('/inbox');
            }}
          >
            Inbox
          </Button>
        </div>
      </Card>
      <Compose />
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
