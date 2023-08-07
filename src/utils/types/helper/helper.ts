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
  console.log('++' + JSON.stringify(formdata));
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
  const firstLetter = input[0].toUpperCase();
  const rest = input.slice(1);
  const together = firstLetter + rest;
  return input ? together.split('@')[0] : '';
};

const transformDate: (curr: Date) => { date: string; time: string } = (
  curr
) => {
  const date = new Date(curr).toDateString();
  const time = new Date(curr).toTimeString().split(' ')[0];

  return { date, time };
};

export { queryServer, getNameFromUser, transformDate };
