import React, { useContext, useEffect, useState } from 'react';
import { List } from 'antd';
import ThreadCard from './threadCard';
import { authContext } from '../../App';
import { threadFromDb } from '../../models/thread.models';
import { COLORS } from '../../constants/constants';
import { queryServer } from '../../utils/types/helper/helper';
import useFetch from '../../hooks/useFetch';
import { userFromDb } from '../../models/user.models';
import { threadContext } from '../../pages/homepage/Homepage2';

export interface Thread {
  message: threadFromDb;
  unread: boolean;
  otherUser: string;
}

const App: React.FC<{ height: number }> = ({ height }) => {
  const { user, setUser, addUnread, setAuth, shouldFetch, setShouldFetch } =
    useContext(authContext);
  const [reloading, setReloading] = useState(false);

  const { messages } = useContext(threadContext);

  const {
    data,
    loading,
  }: {
    data:
      | {
          message: threadFromDb;
          user: userFromDb;
          unread: number;
          otherUser: string;
        }
      | undefined;
    error: Error | undefined;
    loading: boolean;
  } = useFetch({
    path: `/thread/${user?._id}`,
    method: 'get',
  });

  const [threads, setThreads] = useState<threadFromDb[] | undefined>([]);
  const [unread, setUnread] = useState<number[] | undefined>([]);
  const [otherUser, setOtherUser] = useState<string[] | undefined>([]);
  useEffect(() => {
    if (data) {
      const unread = data.unread as unknown as number[];
      setUnread(unread);
      const threads = data.message as unknown as threadFromDb[];
      const otherUser = data.otherUser as unknown as string[];
      setOtherUser(otherUser);
      setThreads(threads);
      setUser && setUser(data.user);
    }
  }, [data]);

  useEffect(() => {
    if (addUnread && unread) {
      threads?.map((thread) =>
        addUnread(thread._id, unread[threads.indexOf(thread)])
      );
    }
  });

  useEffect(() => {
    if (shouldFetch) {
      setReloading(true);
      queryServer({
        method: 'get',
        url: `/thread/${user?._id}`,
        formdata: null,
      })
        .then((res) => {
          const data = res.data;
          const unread = data.unread as unknown as number[];
          setUnread(unread);
          const threads = data.message as unknown as threadFromDb[];
          const otherUser = data.otherUser as unknown as string[];
          setOtherUser(otherUser);
          setThreads(threads);
          setUser && setUser(data.user);
        })
        .catch((error) => {
          if (!(error?.name.toLowerCase() === 'canceledError'.toLowerCase())) {
            setAuth && setAuth(false);
            setUser && setUser(undefined);
          }
        })
        .finally(() => {
          setShouldFetch && setShouldFetch(false);
          setReloading(false);
        });
    }
  }, [setAuth, setUser, messages, user?._id, shouldFetch, setShouldFetch]);

  return (
    <List
      loading={loading || reloading}
      className="overflow-y-auto overflow-x-hidden"
      style={{ backgroundColor: COLORS.base, height: height }}
      dataSource={threads}
      bordered
      renderItem={(thread: threadFromDb, index: number) => (
        <ThreadCard
          thread={thread}
          key={index}
          unread={unread && threads && (unread[index] as number)}
          otherUser={otherUser && threads && (otherUser[index] as string)}
        />
      )}
    />
  );
};

export default App;
