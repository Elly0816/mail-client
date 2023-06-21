import React, { useEffect, useContext } from 'react';
import { List } from 'antd';
import ThreadCard from './threadCard';
import { authContext } from '../../App';
import useFetch from '../../hooks/useFetch';
import { threadFromDb } from '../../models/thread.models';
import { userFromDb } from '../../models/user.models';

export interface Thread {
  message: threadFromDb;
  //   user: userFromDb;
  unread: boolean;
  otherUser: string;
}

const App: React.FC = () => {
  const { user } = useContext(authContext);
  //   const {
  //     data,
  //     error,
  //     loading,
  //   }: {
  //     data: {
  //       message: threadFromDb;
  //       user: userFromDb;
  //       unread: number;
  //       otherUser: string;
  //     };
  //     error: Error | undefined;
  //     loading: boolean;
  //   } = useFetch({
  //     path: `/thread/${user?._id.toString()}`,
  //     method: 'get',
  //   });

  //   useEffect(() => {
  //     data && setUser && setUser(data.user);
  //   }, [data, setUser]);

  return (
    <List
      dataSource={user?.threads}
      renderItem={(id: string) => (
        <ThreadCard threadId={id} key={user?.threads.indexOf(id)} />
      )}
    />
  );
};

export default App;
