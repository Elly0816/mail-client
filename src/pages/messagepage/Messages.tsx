import { useNavigate, useParams } from 'react-router-dom';
import Messages from '../../components/message/Message';
import useFetch from '../../hooks/useFetch';
import { Layout, List, Skeleton } from 'antd';
import Error from '../../components/error/Error';
import Compose from '../../components/compose/ComposeAntD';
import {
  ThreadContextType,
  authContext,
  authContextType,
  emailContextType,
  emailsContext,
  threadContext,
} from '../../contexts/contexts';
import { RefObject, useContext, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { COLORS } from '../../constants/constants';
import { getNameFromUser } from '../../utils/types/helper/helper';
import Header from '../../components/navbar/Navbar';

const MessagePage: React.FC = () => {
  const { messages, setMessages, setUserTo, userTo } = useContext(
    emailsContext
  ) as emailContextType;
  const { setUnreadCount } = useContext(threadContext) as ThreadContextType;
  const { setUser, sessionExpired } = useContext(
    authContext
  ) as authContextType;
  const { id } = useParams();

  const navigate = useNavigate();

  const { data, error, loading } = useFetch({
    path: `/message/${id}`,
    method: 'get',
  });

  useEffect(() => {
    if (data) {
      setMessages(data.message);
      setUser(data.user);
      setUserTo(data.otherUser);
    }
    if (error) {
      setMessages([]);
      setUser(undefined);
      setUnreadCount && setUnreadCount(undefined);
      sessionExpired();
    }
  }, [
    data,
    setUser,
    setMessages,
    setUserTo,
    setUnreadCount,
    sessionExpired,
    error,
  ]);

  let child;

  const listRef: RefObject<HTMLDivElement | null> | null = useRef(null);
  const msgs = listRef?.current as HTMLElement;
  useEffect(() => {
    if (msgs) {
      msgs.scrollTop = msgs?.scrollHeight as number;
    }
  }, [msgs, messages, listRef]);

  //   if (messages.length > 0) {
  console.log('messages: ', data);
  child = (
    <>
      <Header
        h1={'Messages'}
        message={`Send a message to ${
          userTo ? getNameFromUser(userTo as string) : '...'
        }`}
        url={'/homepage'}
        linkText={'Homepage'}
        otherLinkText={'InboxPage'}
        otherUrl={'/inbox'}
        //   otherLinkText='InboxPage'
      />
      <div
        id="scrollableDiv"
        style={{
          height: '80vh',
          overflow: 'auto',
          marginTop: '20px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
          backgroundColor: `${COLORS.base}`,
        }}
        className="col-span-2 p-12"
        ref={listRef as RefObject<HTMLDivElement>}
      >
        <InfiniteScroll
          ref={listRef as unknown as RefObject<InfiniteScroll>}
          dataLength={messages?.length ? messages.length : 0}
          next={() => {
            return null;
          }}
          hasMore={false}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
          // className=" h-full"
        >
          <List
            // className=" h-full"
            // style={{ height: '100%' }}
            loading={loading}
            dataSource={messages}
            // bordered
            renderItem={(item) => <Messages message={item} />}
          />
        </InfiniteScroll>
      </div>
    </>
  );
  //   }

  if (error) {
    navigate('/login');
    child = <Error message={error.message} />;
  }

  return (
    <Layout>
      {child}
      <Compose />
    </Layout>
  );
};

export default MessagePage;
