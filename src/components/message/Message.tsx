import React, { useContext, useEffect } from 'react';
import { Card, Divider, Empty, List, Skeleton, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import useFetch from '../../hooks/useFetch';
import { messageFromDb } from '../../models/message.models';
import { authContext } from '../../App';
import {
  getNameFromUser,
  transformDate,
} from '../../utils/types/helper/helper';
import { COLORS } from '../../constants/constants';

interface Messages {
  id?: string;
  setMessages?: (message: messageFromDb[] | messageFromDb | undefined) => void;
  messages: messageFromDb[];
}

const App: React.FC<Messages> = ({ id, setMessages, messages }) => {
  const {
    data: messagesData,
    loading,
    error,
  } = useFetch({
    method: 'get',
    path: `/message/${id}`,
  });
  // const [data, setData] = useState<messageFromDb[]>([]);

  const { setUser, user, setAuth } = useContext(authContext);

  useEffect(() => {
    if (messages?.length == 0 && id) {
      if (error) {
        if (error?.name.toLowerCase() !== 'canceledError'.toLowerCase()) {
          setAuth && setAuth(false);
        }
      } else {
        setUser && setUser(messagesData.user);
        setMessages && setMessages(messagesData.message as messageFromDb[]);
      }
    }
  }, [messagesData, error, setAuth]);

  return messages.length > 0 || id ? (
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
          dataLength={messages?.length ? messages.length : 0}
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
            loading={messages.length < 1}
            dataSource={messages}
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
                <div className="font-semibold text-lg mb-9">
                  <h2>{item.title}</h2>
                </div>
                <div className="font-normal text-base">
                  <h3>{item.body}</h3>
                </div>
                <hr />
                <div className="font-thin text-xs grid justify-items-end text-end w-fit">
                  <p>{transformDate(item.date).date}</p>
                  <p>{transformDate(item.date).time}</p>
                </div>
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
      style={{
        height: '60vh',
        backgroundColor: COLORS.base,
        color: COLORS.primary,
        padding: 'auto',
      }}
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
