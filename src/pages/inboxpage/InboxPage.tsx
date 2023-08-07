import { Layout } from 'antd';
import Inbox from '../../components/thread/threadList';
import Header from '../../components/navbar/Navbar';

const InboxPage: React.FC = () => {
  // const {setUnreadCount, unreadCount} = useContext(threadContext);

  return (
    <Layout className="h-screen bg-transparent">
      <Header
        h1={'Inbox'}
        message={`Send a new message`}
        url={'/homepage'}
        linkText={'Homepage'}
        otherLinkText={undefined}
        otherUrl={undefined}
        //   otherLinkText='InboxPage'
      />
      <Inbox />
    </Layout>
  );
};

export default InboxPage;
