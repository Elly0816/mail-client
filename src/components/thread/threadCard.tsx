import { Card, Spin } from 'antd';
import React, { useEffect, useContext, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { threadFromDb } from '../../models/thread.models';
import { userFromDb } from '../../models/user.models';
import { authContext } from '../../App';
import {
  getNameFromUser,
  transformDate,
} from '../../utils/types/helper/helper';
import { threadContext } from '../../pages/homepage/Homepage2';
import { COLORS } from '../../constants/constants';
import './Thread.css';

const App: React.FC<{
  threadId: string;
  addUnread: (unread: number) => void;
}> = ({ threadId }) => {
  const { setUser, addUnread, removeUnread } = useContext(authContext);
  const {
    // currentThreadId,
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
    data?.unread && addUnread && addUnread(threadId, data.unread);
    // data?.otherUser && setUserTo && setUserTo(data.otherUser);
  }, [data, error, loading, setUser]);

  const [canRemove, setCanRemove] = useState<boolean>(true);
  const { currentThreadId } = useContext(threadContext);

  return (
    <Card
      title={
        data && (
          <div
            style={{ color: COLORS.primary }}
            className={`center flex flex-col  ${
              canRemove && data.unread > 0 ? 'font-extrabold' : 'font-medium'
            } justify-between	`}
          >
            <div className="text-container">
              <h4 className="animate">{`Thread with ${getNameFromUser(
                data.otherUser
              )}`}</h4>
              {!canRemove ||
                (data.unread > 0 && <h6>{`${data.unread} Unread`}</h6>)}
            </div>
          </div>
        )
      }
      bordered={true}
      // style={{
      //   width: '100%',
      //   height: 200,
      //   borderBottom: 3,
      //   borderTop: 3,
      //   color: COLORS.primary,
      //   borderColor: COLORS.accent,
      //   backgroundColor: COLORS.base,
      // }}
      className={`threadCard rounded-none p-0 hover:cursor-pointer ${
        currentThreadId && currentThreadId == data?.message._id && 'isThread'
      } `}
      loading={loading}
      onClick={() => {
        setThread && setThread(threadId);
        canRemove && removeUnread && removeUnread(data?.unread as number);
        setCanRemove(false);
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
            className="flex flex-grow m-0 px-0 flex-col"
            // style={{ backgroundColor: COLORS.base }}
          >
            <div className="flex flex-row font-semibold justify-center">
              <span>
                {data ? (
                  data.message.lastMessage &&
                  data.message.lastMessage.substring(0, 15) + '...'
                ) : (
                  <Spin />
                )}
              </span>
            </div>
            <div>
              {/* {data ? ( */}
              <div className="flex flex-row text-xs justify-between">
                <p>{transformDate(data.message.lastModified).date}</p>
                <p>{transformDate(data.message.lastModified).time}</p>
              </div>
              {/* ) : ( */}
              {/* <Spin />
              )} */}
            </div>
            {/* <p>{data.name.last}</p> */}
          </div>
        )
      )}
    </Card>
  );
};

export default App;
