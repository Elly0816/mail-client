import { Fragment } from 'react';
import './Thread.css';
import useFetch from '../../hooks/useFetch';
import Loading from '../loading/Loading';
import Error from '../error/Error';
import { useNavigate } from 'react-router-dom';
import { getNameFromUser } from '../../utils/types/helper/helper';

export interface threadProp {
  id: string;
}

const Thread: React.FC<threadProp> = (id) => {
  const navigate = useNavigate();
  console.log(id);
  const { data, error, loading } = useFetch({
    path: `/thread/${id.id.toString()}`,
    method: 'get',
  });

  const child = loading ? (
    <Loading />
  ) : data?.message ? (
    <div
      className={`thread w-full border-solid border-blue-400 border-2 rounded-md my-5 space-x-20 text-stone-50 ${
        data.unread ? 'font-bold' : 'font-normal'
      }`}
    >
      <div
        className="w-5/6 flex place-content-between"
        onClick={() => {
          navigate(`/message/:${data?.message._id}`);
        }}
      >
        {(
          <h3>Click to open thread with {getNameFromUser(data?.otherUser)}</h3>
        ) || <Loading />}

        <h4>Unread: {data.unread}</h4>
      </div>
    </div>
  ) : error && !loading && !data ? (
    <Error message={error.message} />
  ) : null;

  return <Fragment>{child}</Fragment>;
};

export default Thread;
