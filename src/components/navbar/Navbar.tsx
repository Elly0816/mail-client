import { useNavigate } from 'react-router-dom';
import ToggleDrawerButton from '../drawerToggle/DrawerToggle';
import { useContext, useState } from 'react';
import {
  ThreadContextType,
  authContext,
  authContextType,
  drawerContext,
  drawerPropsType,
  emailContextType,
  emailsContext,
  notificationContext,
  notificationContextType,
  threadContext,
} from '../../contexts/contexts';
import {
  getUnreadFromState,
  queryServer,
} from '../../utils/types/helper/helper';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import MoreIcon from '@mui/icons-material/MoreVert';
import CachedIcon from '@mui/icons-material/Cached';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

interface HeaderProps {
  h1: string;
  message: string;
  url: string;
  linkText: string;
  otherUrl: string | undefined;
  otherLinkText: string | undefined;
}

// const unreadCountStyle = {
//   backgroundColor: COLORS.unread,
//   color: COLORS.base,
//   padding: 10,
// } as CSSProperties;

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
  // const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, setIsOpen } = useContext(drawerContext) as drawerPropsType;

  const { setUnreadCount, unreadCount, setShouldFetch } = useContext(
    threadContext
  ) as ThreadContextType;

  const { destroy, loggingOut } = useContext(
    notificationContext
  ) as notificationContextType;

  const navigate = useNavigate();
  const logout: () => void = () => {
    loggingOut();
    // setLoading(true);
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
          // setLoading(false);
          destroy();
          navigate('/login');
        }
      })
      .catch((err) => {
        console.log(err);
        destroy();
        navigate('/login');
        // setLoading(false);
      });
  };

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  function getIconFromText(text: string, url: string): React.ReactElement {
    let element;
    if (text.toLowerCase().includes('inbox')) {
      element = (
        <Badge
          badgeContent={unreadCount && getUnreadFromState(unreadCount)}
          color="error"
        >
          <MailIcon />
        </Badge>
      );
    } else {
      element = <HomeIcon />;
    }
    return (
      <IconButton
        onClick={() => {
          navigate(url);
          setUserTo(undefined);
        }}
        title={text}
        size="large"
        color="inherit"
      >
        {element}
      </IconButton>
    );
  }

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit"> */}
        <ToggleDrawerButton />
        {/* </IconButton> */}
        <Typography>{message}</Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate(url);
          setUserTo(undefined);
        }}
      >
        {getIconFromText(linkText, url)}
        <Typography>{linkText}</Typography>
        {/* <p></p> */}
      </MenuItem>

      {otherLinkText && (
        <MenuItem
          onClick={() => {
            navigate(otherUrl as string);
            setUserTo(undefined);
          }}
        >
          {getIconFromText(otherLinkText, otherUrl as string)}
          <Typography>{otherLinkText}</Typography>

          {/* <p>{otherLinkText}</p> */}
        </MenuItem>
      )}

      <MenuItem
        onClick={() => {
          setShouldFetch(true);
        }}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          color="inherit"
        >
          <CachedIcon />
        </IconButton>
        <Typography>Refresh Inbox</Typography>
      </MenuItem>

      <MenuItem
        onClick={() => {
          logout();
          setUserTo(undefined);
        }}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          color="inherit"
        >
          <LogoutIcon />
        </IconButton>
        <Typography>Logout</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            {h1}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <div
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <ToggleDrawerButton />
                <Typography>{message}</Typography>
              </IconButton>
            </div>

            {getIconFromText(linkText, url)}
            {otherLinkText &&
              getIconFromText(otherLinkText, otherUrl as string)}

            <IconButton
              title="Refresh Inbox"
              size="large"
              edge="end"
              aria-label="account of current user"
              color="inherit"
              onClick={() => {
                setShouldFetch(true);
              }}
            >
              <CachedIcon />
            </IconButton>
            <IconButton
              title="Logout"
              size="large"
              aria-label="account of current user"
              color="inherit"
              onClick={() => {
                logout();
                setUserTo(undefined);
              }}
            >
              <LogoutIcon />
            </IconButton>

            {/**
             Refresh Button
             */}
            {/**
             Logout Button
             */}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {/* {renderMenu} */}
    </Box>
  );
};

export default Header;
