import { useNavigate } from 'react-router-dom';
import './homepage.css';
import React, { Fragment, useContext, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import Loading from '../../components/loading/Loading';
import { authContext } from '../../App';
import useLocalStorage from '../../hooks/useLocalStorage';
import InboxPage from '../inboxpage/inboxPage';
import Error from '../../components/error/Error';
import { getNameFromUser } from '../../utils/types/helper/helper';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface homePageProp {}

const HomePage: React.FC<homePageProp> = () => {
  //   const [threads, setThread] = useThread();

  const { auth, user, setAuth, setUser } = useContext(authContext);
  const navigate = useNavigate();
  const { data, error, loading } = useFetch({
    path: '',
    method: 'get',
    // next: '',
  });
  const [access, setAccess] = useLocalStorage({ name: 'access' });
  const [refresh, setRefresh] = useLocalStorage({ name: 'refresh' });

  const child =
    // (access && refresh) ||
    data?.user ? (
      <InboxPage />
    ) : loading ? (
      <Loading />
    ) : (
      // error && (
      <div>
        <Error message={error?.message as string} />
      </div>
      // )
    );
  useEffect(() => {
    error &&
      error.message.toLowerCase().includes('unauthorized') &&
      console.log('error, going to login');
    console.log(error);
    error &&
      error.message.toLowerCase().includes('unauthorized') &&
      navigate('/login');
  }, [error, navigate]);

  useEffect(() => {
    if (data?.user) {
      setUser && setUser(data?.user);
      setAuth && setAuth(true);
    }
    // else {
    //   // setUser && setUser(undefined);
    //   // setAuth && setAuth(false);
    //   // navigate('/login');
    // }
  }, [data?.user]);

  return (
    <Fragment>
      <div className="place-content-center bg-blue-500">
        {/* <h3>{`Hi ${getNameFromUser(user?.email as string)}`}</h3> */}
        {child}
      </div>
      {/* <div>{item as string}</div> */}
      {/* <div>Hi! I'm Eleazar</div> */}
    </Fragment>
  );
};

export default HomePage;
