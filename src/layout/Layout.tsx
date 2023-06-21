import { ReactNode, useContext } from 'react';
import './layout.css';
import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { authContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { getNameFromUser, queryServer } from '../utils/types/helper/helper';

interface layoutProps {
  children: ReactNode;
}

const { Header, Content, Footer } = Layout;

const LayoutPage: React.FC<layoutProps> = ({ children }) => {
  const { auth, user, setAuth, setUser } = useContext(authContext);
  const navigate = useNavigate();

  const [, setAccess] = useLocalStorage({ name: 'access' });
  const [, setRefresh] = useLocalStorage({ name: 'refresh' });

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const logoutF = () => {
    queryServer({
      method: 'post',
      url: '/logout',
      formdata: undefined,
    })
      .then((res) => {
        console.log(res);
        setAuth && setAuth(false);
        setUser && setUser(undefined);
        setAccess('undefined');
        setRefresh('undefined');
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        navigate('/login');
      });
  };

  const home = <Link to="/">Inbox</Link>;
  //   const inbox = auth && <Link to="/messages">Inbox</Link>;
  const logout = auth ? (
    <div className="logout" onClick={logoutF}>
      Logout
    </div>
  ) : undefined;

  const navArray = [home, logout];

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          //   alignItems: 'center',
        }}
        className="grid grid-cols-2 gap-4 place-content-between"
      >
        {/* <div className="demo-logo" /> */}
        {auth && (
          //   <div className="grid grid-cols-2 gap-4 place-content-between">
          <>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              items={navArray.map((_, index) => ({
                key: String(index + 1),
                label: _,
              }))}
            />
            <div className="font-black text-cyan-50">
              <h4>Hi {getNameFromUser(user?.email as string)}</h4>
            </div>
          </>
          //    {/* </div> */}
        )}
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px' }}>
        <div
          style={{ padding: 24, minHeight: 380, background: colorBgContainer }}
        >
          {/* <Loading /> */}
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Copyright {new Date(Date.now()).getFullYear()}
      </Footer>
    </Layout>
  );
};

export default LayoutPage;
