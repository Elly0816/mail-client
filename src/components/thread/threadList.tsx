import React, { useContext, useEffect, useState } from 'react';
import { List } from 'antd';
import { threadFromDb } from '../../models/thread.models';
import { ThreadContextType, threadContext } from '../../contexts/contexts';
import ThreadItem from './threadCard';
import Compose from '../compose/ComposeAntD';

export interface Thread {
  message: threadFromDb;
  unread: boolean;
  otherUser: string;
}

const Inbox: React.FC = () => {
  const { unreadCount, otherUser, setShouldFetch, setOtherUser } = useContext(
    threadContext
  ) as ThreadContextType;

  const [data, setData] = useState<threadFromDb[] | undefined>(
    unreadCount?.threads
  );
  useEffect(() => {
    setOtherUser && setOtherUser(undefined);
    if (
      unreadCount &&
      unreadCount?.threads.length > 0 &&
      unreadCount?.unread.length > 0
    ) {
      setData(unreadCount.threads);
    } else {
      console.log('There are no threads');
      setShouldFetch(true);
    }
  }, [unreadCount, setShouldFetch, setOtherUser]);

  console.log('data45: ', data);

  return (
    <>
      <List
        className="w-screen h-full"
        bordered
        loading={!data}
        itemLayout="vertical"
        size="large"
        pagination={{
          // onChange: (page) => {
          //   console.log(page);

          // },
          responsive: true,
          // pageSize: 6,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal(total) {
            return `You have ${total} conversations`;
          },
        }}
        dataSource={data}
        renderItem={(item, index) => {
          console.log(index);
          console.log(data?.indexOf(item));

          return (
            <ThreadItem
              otherUser={otherUser as string[]}
              item={item}
              data={data as threadFromDb[]}
              unreadCount={unreadCount}
            />
          );
        }}
      />
      <Compose />
    </>
  );
};

export default Inbox;
