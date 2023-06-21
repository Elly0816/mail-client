import { AxiosResponse } from 'axios';
import instance from '../../../controllers/axios.controllers';

const queryServer = ({
  method,
  url,
  formdata,
}: {
  method: string;
  url: string;
  formdata: unknown;
}): Promise<AxiosResponse<AxiosResponse['data'], Error>> => {
  const controller = new AbortController();
  const config = {
    method: method,
    url: url,
    signal: controller.signal,
    data: formdata,
  };
  return instance(config);
};

const getNameFromUser = (input: string): string => {
  console.log(input);
  return input ? input.split('@')[0] : '';
};

export { queryServer, getNameFromUser };
