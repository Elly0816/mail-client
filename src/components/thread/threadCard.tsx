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
          <div className="text-start font-thin">
            <h4>{`${getNameFromUser(otherUser as string)}`}</h4>
          </div>
        </div>
      }
      cover={
        <div className="font-semibold">
          <h3>Title: {thread.lastTitle}</h3>
        </div>
      }
      bordered={true}
      hoverable
      extra={
        !canRemove ||
        (unread && unread > 0 ? (
          <div className="bg-green-600 text-white shadow-lg rounded-2xl w-7">
            <h6 className="text-white-600">{`${unread}`}</h6>
          </div>
        ) : null)
      }
      className={`threadCard rounded-none p-0
       hover:cursor-pointer ${
         currentThreadId && currentThreadId == thread._id && 'isThread'
       } `}
      // loading={loading}
      onClick={() => {
        if (currentThreadId != thread._id) {
          setThread && setThread(thread._id);
          canRemove && removeUnread && removeUnread(unread as number);
          setCanRemove(false);
          setUserTo && setUserTo(otherUser as string);
          setMessages && setMessages(undefined);
        }
        // setThread && setThread(currentThreadId as string);
      }}
    >
      <div
        className="flex flex-grow m-0 px-0 flex-col w-full"
        // style={{ backgroundColor: COLORS.base }}
      >
        <div className="flex flex-row font-light justify-start">
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
