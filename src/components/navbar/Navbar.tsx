import { Link, useNavigate } from 'react-router-dom';
import ToggleDrawerButton from '../drawerToggle/DrawerToggle';
import { CSSProperties, useContext, useState } from 'react';
import {
  ThreadContextType,
  authContext,
  authContextType,
  emailContextType,
  emailsContext,
  notificationContext,
  notificationContextType,
  threadContext,
} from '../../contexts/contexts';
import { Button } from 'antd';
import { queryServer } from '../../utils/types/helper/helper';
import { COLORS } from '../../constants/constants';

interface HeaderProps {
  h1: string;
  message: string;
  url: string;
  linkText: string;
  otherUrl: string | undefined;
  otherLinkText: string | undefined;
}

const unreadCountStyle = {
  backgroundColor: COLORS.unread,
  color: COLORS.base,
  padding: 10,
} as CSSProperties;

const Header: React.FC<HeaderProps> = ({
  h1,
  linkText,
  message,
  url,
  otherUrl,
  otherLinkText,
}) => {
  const { setUserTo, setMessages } = useContext(
    emailsContext
  ) as emailContextType;
  const { setAuth, setUser } = useContext(authContext) as authContextType;
  const [loading, setLoading] = useState<boolean>(false);

  const { setUnreadCount, unreadCount, setShouldFetch } = useContext(
    threadContext
  ) as ThreadContextType;

  const { destroy, loggingOut } = useContext(
    notificationContext
  ) as notificationContextType;

  const navigate = useNavigate();
  const logout: () => void = () => {
    loggingOut();
    setLoading(true);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setAuth && setAuth(false);
    setUser && setUser(undefined);
    setUnreadCount && setUnreadCount(undefined);
    setMessages([]);
    queryServer({ method: 'post', url: '/logout', formdata: null })
      .then((res) => {
        console.log('+++' + JSON.stringify(res));
        if (res.status === 200) {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
      .finally(() => {
        destroy();
        navigate('/login');
      });
  };

  return (
    <div className="font-black text-left text-xl flex flex-row justify-evenly items-end my-5">
      <h1>{h1}</h1>
      {unreadCount &&
        unreadCount.unread.reduce((prev, curr) => prev + curr) > 0 && (
          <div
            className="rounded-full h-10 w-15 text-base"
            style={unreadCountStyle}
          >
            <p> {unreadCount.unread.reduce((prev, curr) => prev + curr)}</p>
          </div>
        )}
      <ToggleDrawerButton message={message} />
      <Link
        className="font-normal text-base"
        to={url}
        onClick={() => {
          setUserTo(undefined);
        }}
      >
        {linkText}
      </Link>
      {otherUrl && (
        <Link
          className="font-normal text-base"
          to={otherUrl}
          onClick={() => {
            setUserTo(undefined);
          }}
        >
          {otherLinkText}
        </Link>
      )}
      <Button
        onClick={() => {
          setShouldFetch(true);
        }}
      >
        Refresh Inbox
      </Button>
      <Button
        onClick={() => {
          !loading && logout();
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Header;
