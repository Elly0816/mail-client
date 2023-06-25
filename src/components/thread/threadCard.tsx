import { Card } from 'antd';
import React, { useContext, useState } from 'react';
import { threadFromDb } from '../../models/thread.models';
import { authContext } from '../../App';
import {
  getNameFromUser,
  transformDate,
} from '../../utils/types/helper/helper';
import { threadContext } from '../../pages/homepage/Homepage2';
import { COLORS } from '../../constants/constants';
import './Thread.css';

const App: React.FC<{
  thread: threadFromDb;
  // addUnread: (unread: number) => void;
  unread?: number;
  otherUser?: string;
}> = ({ thread, otherUser, unread }) => {
  const { removeUnread } = useContext(authContext);
  const {
    // currentThreadId,
    setThread,
    changeOtherUser: setUserTo,
    setMessages,
  } = useContext(threadContext);

  // const {
  //   data,
  //   error,
  //   loading,
  // }: {
  //   data:
  //     | {
  //         message: threadFromDb;
  //         user: userFromDb;
  //         unread: number;
  //         otherUser: string;
  //       }
  //     | undefined;
  //   error: Error | undefined;
  //   loading: boolean;
  // } = useFetch({
  //   path: `/thread/${threadId}`,
  //   method: 'get',
  // });

  // useEffect(() => {
  //   console.log(data, error, loading);
  //   data?.user && setUser && setUser(data?.user);
  //   data?.unread && addUnread && addUnread(threadId, data.unread);
  //   // data?.otherUser && setUserTo && setUserTo(data.otherUser);
  // }, [data, error, loading, setUser]);

  const [canRemove, setCanRemove] = useState<boolean>(true);
  const { currentThreadId } = useContext(threadContext);

  return (
    <Card
      title={
        <div
          style={{ color: COLORS.primary }}
          className={`center flex flex-col  ${
            canRemove && unread && unread > 0 ? 'font-extrabold' : 'font-medium'
          } justify-between	`}
        >
          <div className="text-start">
            <h4>{`Thread with ${getNameFromUser(otherUser as string)}`}</h4>
            {!canRemove ||
              (unread && unread > 0 ? (
                <h6 className="text-green-600">{`${unread} Unread`}</h6>
              ) : null)}
          </div>
        </div>
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
        currentThreadId && currentThreadId == thread._id && 'isThread'
      } `}
      // loading={loading}
      onClick={() => {
        setThread && setThread(thread._id);
        canRemove && removeUnread && removeUnread(unread as number);
        setCanRemove(false);
        setUserTo && setUserTo(otherUser as string);
        setMessages && setMessages(undefined);
        // setThread && setThread(currentThreadId as string);
      }}
    >
      <div
        className="flex flex-grow m-0 px-0 flex-col"
        // style={{ backgroundColor: COLORS.base }}
      >
        <div className="flex flex-row font-semibold justify-start">
          <p>
            {thread.lastMessage && thread.lastMessage.substring(0, 25) + '...'}
          </p>
        </div>
        <div>
          {/* {data ? ( */}
          <div className="flex flex-row text-xs justify-end">
            {/* <p>{transformDate(data.message.lastModified).date}</p> */}
            <p>{transformDate(thread.lastModified).time}</p>
          </div>
          {/* ) : ( */}
          {/* <Spin />
              )} */}
        </div>
        {/* <p>{data.name.last}</p> */}
      </div>
    </Card>
  );
};

export default App;
