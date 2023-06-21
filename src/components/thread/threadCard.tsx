import { Card } from 'antd';
import React, { useEffect, useContext } from 'react';
import useFetch from '../../hooks/useFetch';
import { threadFromDb } from '../../models/thread.models';
import { userFromDb } from '../../models/user.models';
import { authContext } from '../../App';
// import ErrorIcon from '@mui/icons-material/Error';
import { getNameFromUser } from '../../utils/types/helper/helper';

const App: React.FC<{ threadId: string }> = ({ threadId }) => {
  const { setUser } = useContext(authContext);

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
  }, [data, setUser]);

  return (
    <Card
      title={
        data &&
        `${getNameFromUser(data.otherUser)} 
        
        `
      }
      bordered={true}
      style={{ width: 300 }}
      className="rounded-none border-y-5"
      loading={loading}
    >
      {error ? (
        <div>Error</div>
      ) : (
        data && (
          // <ErrorIcon />
          <>
            <p>{data.message.lastMessage}</p>
            <p>{data.message.lastModified.toString()}</p>
            {/* <p>{data.name.last}</p> */}
          </>
        )
      )}
    </Card>
  );
};

export default App;
