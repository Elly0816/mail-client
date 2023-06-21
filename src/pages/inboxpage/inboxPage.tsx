import { Fragment, useContext, useMemo } from 'react';
import { authContext } from '../../App';
import { useNavigate } from 'react-router-dom';

import Thread from '../../components/thread/Thread';
import Compose from '../../components/compose/ComposeAntD';
import { getNameFromUser, queryServer } from '../../utils/types/helper/helper';
import useLocalStorage from '../../hooks/useLocalStorage';
import './inboxPage.css';

const InboxPage: React.FC = () => {
  const { user } = useContext(authContext);

  // const navigate = useNavigate();

  // const [access, setAccess] = useLocalStorage({ name: 'access' });
  // const [refresh, setRefresh] = useLocalStorage({ name: 'refresh' });

  // // const logout = () => {
  // //   queryServer({
  // //     method: 'post',
  // //     url: '/logout',
  // //     formdata: undefined,
  // //   })
  // //     .then((res) => {
  // //       console.log(res);
  // //       setAuth && setAuth(false);
  // //       setUser && setUser(undefined);
  // //       setAccess('undefined');
  // //       setRefresh('undefined');
  // //     })
  // //     .catch((err) => {
  // //       console.log(err);
  // //     })
  // //     .finally(() => {
  // //       navigate('/login');
  // //     });
  // // };

  return (
    <Fragment>
      <div className="p-10 flex-col">
        {/* <div>
          <button onClick={logout}>Logout</button>
        </div> 
        <div>
          <h3>{`Hi ${getNameFromUser(user?.email as string)}`}</h3>
        </div> */}
        <div className="threads overflow-y-auto flex-grow  h-2/4">
          {user && user.threads.length > 0 ? (
            user['threads'].map((thread, index) => {
              console.log(thread);
              console.log('This is a single thread');
              return <Thread key={index} id={thread} />;
            })
          ) : (
            <div>
              <h3>There are no threads</h3>
            </div>
          )}
        </div>
        <div className="flex-grow  h2/4">
          {user && <Compose title="Compose a new Message" method="post" />}
        </div>
      </div>
    </Fragment>
  );
};

export default InboxPage;
