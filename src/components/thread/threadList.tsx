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
      className="oveflow-y h-screen w-auto"
      style={{ backgroundColor: COLORS.secondary }}
      dataSource={user?.threads}
      renderItem={(id: string) => (
        <ThreadCard
          addUnread={addUnread as () => void}
          threadId={id}
          key={user?.threads.indexOf(id)}
        />
      )}
    />
  );
};

export default App;
