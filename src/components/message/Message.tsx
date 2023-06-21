import { messageFromDb } from '../../models/message.models';
import './message.css';

import { Card } from 'antd';
import React from 'react';

const Message: React.FC<{ message: messageFromDb }> = ({ message }) => (
  <Card
    className="m-auto self-center w-0 my-5"
    title={message.title}
    bordered={false}
    style={{ width: 300 }}
  >
    <h3>From: {message.from}</h3>
    <h5>{message.body}</h5>
    <p>Sent at: {message.date.toString().replace('T', ', ')}</p>
    {/* <p>Card content</p>
    <p>Card content</p> */}
  </Card>
);

export default Message;
