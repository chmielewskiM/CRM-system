import React from 'react';
import { AxiosResponse } from 'axios';
import { Message, MessageHeader } from 'semantic-ui-react';

interface IProps {
  error: AxiosResponse;
  text?: string;
}

const ErrorMessage: React.FC<IProps> = ({ text }) => {
  return (
    <Message error>
      <MessageHeader></MessageHeader>
      {text && <Message.Content content={text} />}
    </Message>
  );
};

export default ErrorMessage;
