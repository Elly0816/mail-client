import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { Spin } from 'antd';
import { userFromDb } from '../../models/user.models';
import {
  authContext,
  authContextType,
  ThreadContextType,
  threadContext,
} from '../../contexts/contexts';
import useFetch from '../../hooks/useFetch';
import Error from '../../components/error/Error';
import { threadInfoFromServer } from '../../utils/types/types.utils';

const WelcomePage: React.FC = () => {
  const { setUser, user, setAuth } = useContext(authContext) as authContextType;
  const { setUnreadCount, setOtherUser, unreadCount } = useContext(
    threadContext
  ) as ThreadContextType;
  const navigate = useNavigate();
  console.log('user: ', user);

  const {
    data,
    error,
    loading,
  }: {
    data: threadInfoFromServer;
    error: Error | undefined;
    loading: boolean;
  } = useFetch({
    path: `/thread/${user?._id}`,
    method: 'get',
  });

  useEffect(() => {
    if (data) {
      setAuth && setAuth(true);
      setUser && setUser(data.user as userFromDb);

      setUnreadCount &&
        setUnreadCount({
          threads: data.message,
          unread: data.unread,
        });
      setOtherUser && setOtherUser(data.otherUser);
      console.log('This is the data: ', data);
      // navigate('/homepage');
    }

    if (error) {
      console.log(error);
      navigate('/login');
    }
  }, [navigate, data, error, setUnreadCount, setAuth, setUser, setOtherUser]);

  useEffect(() => {
    if (unreadCount?.threads && unreadCount.unread) {
      navigate('/homepage');
    }
  }, [unreadCount, navigate]);
  // const {} = useFetch({path: `/thread/${user._id}`})

  return loading ? (
    <Spin
      // style={{ paddingTop: '50%', height: '100vh' }}
      className="flex justify-center items-center h-screen"
    />
  ) : (
    error && <Error message={'There was an error'} />
  );
};

export default WelcomePage;
