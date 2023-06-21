import React, { Fragment, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { queryServer } from '../../utils/types/helper/helper';
import { UseFetchProps } from '../../hooks/useFetch';
import { authContext } from '../../App';

export interface composeInterface {
  method: UseFetchProps['method'];
  threadId?: string;
  to?: string;
  // message:{from:string, to:string, message:string, threadId?:string|undefined}
}

interface Inputs {
  to: string;
  title: string;
  body: string;
}

const Compose: React.FC<composeInterface> = ({ method, threadId, to }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  console.log(watch('to')); // watch input value by passing the name of it
  const { setUser, user } = useContext(authContext);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const config = {
      formdata: {
        message: {
          from: user?.email,
          to: to ? to : data.to,
          title: data.title,
          body: data.body,
          threadId: threadId,
        },
      },
      method: method as string,
      url: '/message',
    };
    console.log(config);

    queryServer(config)
      .then((res) => {
        setUser && setUser(res.data.user);
        console.log('xxx' + res);
      })
      .catch((e) => console.log(e));
    reset();
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <Fragment>
      <h1>Send a message</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <input placeholder="title" {...register('title')} />
        {!to && (
          <input placeholder="email" {...register('to', { required: true })} />
        )}

        {/* include validation with required or other standard HTML validation rules */}
        <input placeholder="body" {...register('body', { required: true })} />
        {/* errors will return when field validation fails  */}
        {errors.to && <span>Enter the receivers Email! </span>}

        <input type="submit" />
      </form>
    </Fragment>
  );
};

export default Compose;
