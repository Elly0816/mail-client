import { List } from 'antd';
import React, { CSSProperties, useContext } from 'react';
import { threadFromDb } from '../../models/thread.models';
import {
  getNameFromUser,
  transformDate,
} from '../../utils/types/helper/helper';
import { COLORS } from '../../constants/constants';
import './Thread.css';
import { useNavigate } from 'react-router-dom';
import {
  ThreadContextType,
  emailContextType,
  emailsContext,
  threadContext,
} from '../../contexts/contexts';

interface threadItemProps {
  otherUser: string[];
  item: threadFromDb;
  data: threadFromDb[];
  unreadCount:
    | {
        threads: threadFromDb[];
        unread: number[];
      }
    | undefined;
}

const unreadStyle = {
  fontWeight: 'bolder',
} as CSSProperties;

const unreadCountStyle = {
  backgroundColor: COLORS.unread,
  color: COLORS.base,
  padding: 10,
} as CSSProperties;

const ThreadItem: React.FC<threadItemProps> = ({
  otherUser,
  item,
  data,
  unreadCount,
}) => {
  const { setMessages, setThreadId } = useContext(
    emailsContext
  ) as emailContextType;

  const { setUnreadCount } = useContext(threadContext) as ThreadContextType;
  const navigate = useNavigate();

  const markAsRead: () => void = () => {
    setUnreadCount &&
      setUnreadCount((value) => {
        let newData;
        if (value != undefined) {
          const currentUnread = value.unread;
          currentUnread[data?.indexOf(item) as number] = 0;
          newData = { threads: value.threads, unread: currentUnread };
        }
        return newData;
      });
  };
  return (
    <List.Item
      onClick={() => {
        setMessages([]);
        markAsRead();
        setThreadId(unreadCount?.threads[data?.indexOf(item) as number]._id);
        navigate(`/messages/${item._id}`);
      }}
      className="isThread"
      extra={
        <div
          className="rounded-full h-10 w-10"
          style={
            unreadCount && unreadCount.unread[data?.indexOf(item) as number] > 0
              ? unreadCountStyle
              : {}
          }
        >
          <p>
            {' '}
            {unreadCount &&
              unreadCount.unread[data?.indexOf(item) as number] > 0 &&
              unreadCount.unread[data?.indexOf(item) as number]}
          </p>
        </div>
      }
      title={otherUser && otherUser[data?.indexOf(item) as number]}
      style={
        unreadCount && unreadCount.unread[data?.indexOf(item) as number] > 0
          ? unreadStyle
          : {}
      }
    >
      <List.Item.Meta
        className="flex flex-row text-left"
        // avatar={<Avatar src={item.picture.large} />}
        title={
          otherUser && getNameFromUser(otherUser[data?.indexOf(item) as number])
        }
        description={
          item.lastTitle &&
          // <div>
          item.lastTitle
            .toUpperCase()
            .concat(' - ', item.lastMessage)
            .substring(0, 35)
            .concat('...')
          // </div>
        }
        // description={item.lastMessage}
      />
      {item.lastModified && (
        <div className="flex flex-col text-right font text-xs">
          <h6>{transformDate(item.lastModified).date}</h6>
          <h6>{transformDate(item.lastModified).time}</h6>
          {/* {unreadCount && unreadCount.unread[data?.indexOf(item) as number]} */}
        </div>
      )}
      {/* </Skeleton> */}
    </List.Item>
  );
};

export default ThreadItem;
