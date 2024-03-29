import { useEffect, useState } from 'react';
import instance from '../controllers/axios.controllers';
import { AxiosError, AxiosResponse } from 'axios';
import { user, message } from '../utils/types/types.utils';
export interface Usefetch {
  loading: boolean;
  error: Error | undefined;
  data: AxiosResponse['data'] | undefined;
}

export interface UseFetchProps {
  path: string | undefined;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete' | undefined;
  formdata?: user | message | undefined;
}

const useFetch = ({
  path,
  method,
  formdata,
}: // next
UseFetchProps): Usefetch => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState();

  console.log(path, method, formdata);

  if (method && method != 'get' && !formdata) {
    setError(new Error('There was no data given'));
  }
  useEffect(() => {
    console.log('current');
    // console.log(current);
    const controller = new AbortController();
    const config = {
      method: method,
      url: path?.toString(),
      signal: controller.signal,
      data: formdata,
    };

    console.log(config);

    instance(config)
      .then(async (res: AxiosResponse) => {
        console.log(res);
        setData(res.data);
        setError(undefined);
        // }
      })
      .catch((err: AxiosError) => {
        console.log('error');
        console.log(err);
        const text = err.response?.statusText;
        setError(new Error(err.message + '\n' + text));
        setData(undefined);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [path, method, formdata]);

  console.log({
    loading: loading,
    error: error,
    data: data,
    // setCurrent: setCurrent,
  });

  return { loading, error, data };
  // /setCurrent
};

export default useFetch;
