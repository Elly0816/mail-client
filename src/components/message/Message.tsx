import React from 'react';
import { Descriptions } from 'antd';
import { messageFromDb } from '../../models/message.models';
import { transformDate } from '../../utils/types/helper/helper';

interface Message {
  // id?: string;
  // setMessages?: (message: messageFromDb[] | messageFromDb | undefined) => void;
  message: messageFromDb;
}

const Messages: React.FC<Message> = ({ message }) => {
  // console.log(`The id is: `, id);

  // const label =

  return (
    <Descriptions
      title={message.title}
      className="my-10 mx-5 rounded-md p-5"
      style={{ backgroundColor: 'white' }}
    >
      <Descriptions.Item label="From">{message.from}</Descriptions.Item>
      <Descriptions.Item label="Date">
        {transformDate(message.date).date}
      </Descriptions.Item>
      <Descriptions.Item label="Time">
        {transformDate(message.date).time}
      </Descriptions.Item>
      {/* <Descriptions.Item label="Remark">empty</Descriptions.Item> */}
      <Descriptions.Item label="Message">{message.body}</Descriptions.Item>
    </Descriptions>
  );
};

export default Messages;
