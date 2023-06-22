import React, { useContext, useEffect, useState } from 'react';
import { Card, Divider, Empty, List, Skeleton, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import useFetch from '../../hooks/useFetch';
import { messageFromDb } from '../../models/message.models';
import { authContext } from '../../App';
import { getNameFromUser } from '../../utils/types/helper/helper';

interface Messages {
  id?: string;
}

const App: React.FC<Messages> = ({ id }) => {
  const { data: messagesData, loading } = useFetch({
    method: 'get',
    path: `/message/${id}`,
  });
  const [data, setData] = useState<messageFromDb[]>([]);

  const { setUser, user } = useContext(authContext);

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
          height: '60vh',
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
            style={{ height: '100%' }}
            loading={loading}
            dataSource={data}
            renderItem={(item) => (
              <Card
                className={`text-left h-1/3 my-10 text-slate-50 ${
                  item.from == user?.email ? 'bg-green-500' : 'bg-blue-500'
                }`}
                title={
                  <div className=" text-slate-50">
                    <h4>{getNameFromUser(item.from)}</h4>
                  </div>
                }
              >
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
      <Spin style={{ height: '50vh' }} className="col-span-2 h-3/6" />
      // {/* </div> */}
    )
  ) : (
    <Empty
      description="Click on a Thread to View message"
      style={{ height: '60vh' }}
    />
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
