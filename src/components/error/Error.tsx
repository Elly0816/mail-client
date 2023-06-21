import { Fragment } from 'react';

const Error: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Fragment>
      <h3>{message}</h3>
    </Fragment>
  );
};

export default Error;
