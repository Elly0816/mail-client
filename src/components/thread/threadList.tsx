import React, { useContext } from 'react';
import { List } from 'antd';
import ThreadCard from './threadCard';
import { authContext } from '../../App';
import { threadFromDb } from '../../models/thread.models';
import { COLORS } from '../../constants/constants';

export interface Thread {
  message: threadFromDb;
  //   user: userFromDb;
  unread: boolean;
  otherUser: string;
}

const App: React.FC = () => {
  const { user, addUnread } = useContext(authContext);

  return (
    <List
      className="overflow-y-scroll h-screen "
      style={{ backgroundColor: COLORS.base }}
      dataSource={user?.threads}
      renderItem={(id: string) => (
        <div
          style={{ borderColor: COLORS.accent }}
          //  className="border-y-4 py-2"
        >
          <ThreadCard
            addUnread={addUnread as () => void}
            threadId={id}
            key={user?.threads.indexOf(id)}
          />
        </div>
      )}
    />
  );
};

export default App;
