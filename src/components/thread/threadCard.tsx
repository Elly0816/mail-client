import { Card, Spin } from 'antd';
import React, { useEffect, useContext } from 'react';
import useFetch from '../../hooks/useFetch';
import { threadFromDb } from '../../models/thread.models';
import { userFromDb } from '../../models/user.models';
import { authContext } from '../../App';
import { getNameFromUser } from '../../utils/types/helper/helper';
import { threadContext } from '../../pages/homepage/Homepage2';
import { COLORS } from '../../constants/constants';

const App: React.FC<{
  threadId: string;
  addUnread: (unread: number) => void;
}> = ({ threadId, addUnread }) => {
  const { setUser } = useContext(authContext);
  const {
    currentThreadId,
    setThread,
    changeOtherUser: setUserTo,
  } = useContext(threadContext);

  const {
    data,
    error,
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
    path: `/thread/${threadId}`,
    method: 'get',
  });

  useEffect(() => {
    console.log(data, error, loading);
    data?.user && setUser && setUser(data?.user);
    data?.unread && addUnread(data.unread as number);
    // data?.otherUser && setUserTo && setUserTo(data.otherUser);
  }, [data, setUser, currentThreadId, error, loading, addUnread]);

  return (
    <Card
      title={
        data && (
          <div
            className={`flex flex-row hover:text-slate-50  ${
              data.unread > 0 ? 'font-extrabold' : 'font-medium'
            } justify-between	`}
          >
            <h4>{`Messages with ${getNameFromUser(data.otherUser)}`}</h4>
            <h6>{`${data.unread} Unread`}</h6>
          </div>
        )
      }
      bordered={true}
      style={{
        width: 300,
        height: 200,
        borderWidth: 3,
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.primary,
      }}
      className="rounded-none border-y-2 border-slate-500 hover:cursor-pointer hover:bg-gray-500 hover:text-slate-50 p-0"
      loading={loading}
      onClick={() => {
        setThread && setThread(threadId);
        data && setUserTo && setUserTo(data.otherUser);
        // setThread && setThread(currentThreadId as string);
      }}
    >
      {error ? (
        <div>Error</div>
      ) : (
        data && (
          // <ErrorIcon />
          <div
            className="flex flex-grow m-0 px-0"
            style={{ backgroundColor: COLORS.primary }}
          >
            <p>
              {data ? (
                data.message.lastMessage &&
                data.message.lastMessage.substring(0, 15) + '...'
              ) : (
                <Spin />
              )}
            </p>
            <p>
              {data ? (
                data.message.lastModified.toString().split('T')[0]
              ) : (
                <Spin />
              )}
            </p>
            {/* <p>{data.name.last}</p> */}
          </div>
        )
      )}
    </Card>
  );
};

export default App;
