import React, { useContext, useEffect, useState } from 'react';
import { Card, Divider, Empty, List, Skeleton, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import useFetch from '../../hooks/useFetch';
import { messageFromDb } from '../../models/message.models';
import { authContext } from '../../App';

interface Messages {
  id?: string;
}

const App: React.FC<Messages> = ({ id }) => {
  const { data: messagesData, loading } = useFetch({
    method: 'get',
    path: `/message/${id}`,
  });
  const [data, setData] = useState<messageFromDb[]>([]);

  const { setUser } = useContext(authContext);

  useEffect(() => {
    if (messagesData) {
      setData(messagesData.message as messageFromDb[]);
      setUser && setUser(messagesData.user);
    }
  }, [messagesData, setUser]);

  return id ? (
    !loading ? (
      <div
        id="scrollableDiv"
        style={{
          height: '50%',
          overflow: 'auto',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
        className="col-span-2 h-3/6"
      >
        <InfiniteScroll
          dataLength={data?.length ? data.length : 0}
          next={() => {
            return null;
          }}
          hasMore={false}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
          // className=" h-full"
        >
          <List
            // className=" h-full"
            loading={loading}
            dataSource={data}
            renderItem={(item) => (
              <Card className="my-5 h-64" title={item.title}>
                <h3>{item.body}</h3>
                <br />
                <p>{item.date.toString()}</p>
              </Card>
            )}
          />
        </InfiniteScroll>
      </div>
    ) : (
      // <div style={{ height: '50%' }} className="col-span-2 h-3/6">
      <Spin style={{ height: '100%' }} className="col-span-2 h-3/6" />
      // {/* </div> */}
    )
  ) : (
    <Empty description="Click on a Thread to View message" className="h-3/6" />
  );
};

export default App;

// import { messageFromDb } from '../../models/message.models';
// import './message.css';

// import { Card } from 'antd';
// import React from 'react';

// const Message: React.FC<{ message: messageFromDb }> = ({ message }) => (
//   <Card
//     className="m-auto self-center w-0 my-5"
//     title={message.title}
//     bordered={false}
//     style={{ width: 300 }}
//   >
//     <h3>From: {message.from}</h3>
//     <h5>{message.body}</h5>
//     <p>Sent at: {message.date.toString().replace('T', ', ')}</p>
//     {/* <p>Card content</p>
//     <p>Card content</p> */}
//   </Card>
// );

// export default Message;
