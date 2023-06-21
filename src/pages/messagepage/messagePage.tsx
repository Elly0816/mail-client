import { Fragment, useEffect, useContext } from 'react';
import useFetch from '../../hooks/useFetch';
import Message from '../../components/message/Message';
import Compose from '../../components/compose/ComposeAntD';
import './messagePage.css';
import { getNameFromUser } from '../../utils/types/helper/helper';
import { authContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/loading/Loading';

const MessagePage: React.FC<{ match: any; location: any }> = ({ location }) => {
  //   console.log(match, location.pathname.split(':').at(-1));
  const path = location.pathname.split(':').at(-1);
  const { data, loading, error } = useFetch({
    method: 'get',
    path: `/message/${path}`,
  });

  const { setUser, setAuth } = useContext(authContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (data?.user) {
      setUser && setUser(data.user);
      setAuth && setAuth(true);
    } else if (data?.message.toLowerCase() === 'unauthorized'.toLowerCase()) {
      setUser && setUser(undefined);
      setAuth && setAuth(false);
      navigate('/login');
    }
  }, [data, setUser, setAuth, navigate]);

  return (
    <Fragment>
      <div className="p-10 flex-col">
        <h3>Here are your Messages</h3>
        <div className="messages overflow-y-auto flex-grow m-5 bg-blue-500 rounded-lg  border-4 border-black-900">
          {data ? (
            data.message.map((m: any) => <Message key={m._id} message={m} />)
          ) : (
            <Loading />
          )}
        </div>
        <div className="flex-grow compose">
          <Compose
            title={data && 'Send to ' + getNameFromUser(data?.otherUser)}
            to={data?.otherUser}
            method={'post'}
            threadId={path}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default MessagePage;
