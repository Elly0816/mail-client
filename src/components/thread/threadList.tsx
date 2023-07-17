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
  //   user: userFromDb;
  unread: boolean;
  otherUser: string;
}

const App: React.FC = () => {
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
  // useEffect(()=>{
  //   queryServer({method: 'get', url:''})
  // }, [user]);
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
    // const currentThreadIdInThreads =
    //   threads &&
    //   currentThreadId &&
    //   threads?.filter(
    //     (thread) => (thread._id as string) == (currentThreadId as string)
    //   ).length > 0;

    // const lastMessageOnCard =
    //   threads &&
    //   currentThreadId &&
    //   threads?.filter((thread) =>
    //     thread.messages.filter((message) =>
    //       messages?.filter((messageState) => messageState._id == message)
    //     )
    //   ).length > 0;

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
      className="overflow-y-scroll h-screen "
      style={{ backgroundColor: COLORS.base }}
      dataSource={threads}
      renderItem={(thread: threadFromDb) => (
        <div
          style={{ borderColor: COLORS.accent }}
          //  className="border-y-4 py-2"
        >
          <ThreadCard
            // addUnread={addUnread as () => void}
            thread={thread}
            key={threads?.indexOf(thread)}
            unread={
              unread && threads && (unread[threads?.indexOf(thread)] as number)
            }
            otherUser={
              otherUser &&
              threads &&
              (otherUser[threads?.indexOf(thread)] as string)
            }
          />
        </div>
      )}
    />
  );
};

export default App;
