import React, { useContext, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { authContext, authContextType } from '../../App';
import { queryServer } from '../../utils/types/helper/helper';
import { userFromDb } from '../../models/user.models';
import { AxiosError } from 'axios';

type Inputs = {
  email: string;
  password: string;
  password2: string;
};

export interface loginFormInput {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpForm: React.FC<loginFormInput> = ({ setLoading }) => {
  const { setAuth, setUser } = useContext(authContext) as authContextType;
  // const { data, error, loading, setGo, setCurrent } = useFetch({
  //   method: undefined,
  //   path: undefined,
  //   formdata: undefined,
  //   next: '/',
  // }) as Usefetch;
  const {
    register,
    handleSubmit,
    // watch,
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  //   const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);

    queryServer({
      formdata: { email: data.email, password: data.password },
      method: 'post',
      url: '/signup',
    })
      .then((res) => {
        const { user } = res.data;
        console.log(res);
        if (user) {
          setUser && setUser(user as userFromDb);
          setAuth && setAuth(true);
        }
      })
      .catch((e: AxiosError) => {
        if (e.response?.status === 403) {
          //   navigate('/login');
        }
        setAuth && setAuth(false);
        console.log(e);
      });
    // navigate('');
    reset();
    setLoading(false);
    return !errors.email && !errors.password && console.log(data);
  };

  // console.log(watch('email')); // watch input value by passing the name of it

  useEffect(() => {
    setError('email', {
      types: {
        required: 'This is required',
        minLength: 'This is the min Length',
      },
    });
    setError('password', {
      types: {
        required: 'This is required',
        minLength: 'This is the min Length',
      },
    });
    setError('password2', {
      types: {
        value: getValues('password'),
        required: 'This is required',
        minLength: 'This is the min Length',
      },
    });

    (errors.email || errors.password || errors.password2) &&
      console.log(errors);
  }, [setError]);

  const submitButton = useRef(null);

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form>
      {/* register your input into the hook by invoking the "register" function */}
      <input placeholder="email" {...register('email', { required: true })} />

      {/* include validation with required or other standard HTML validation rules */}
      <input
        {...register('password', { required: true })}
        placeholder="password"
      />
      <input
        {...register('password2', { required: true })}
        placeholder="password2"
      />
      {/* errors will return when field validation fails  */}
      {errors.email && <span>{errors.email.message || 'email error'}</span>}
      {errors.password && (
        <span>{errors.password.message || 'password error'}</span>
      )}
      {errors.password2 && (
        <span>{errors.password2.message || 'second password error'}</span>
      )}

      <input
        ref={submitButton}
        type="submit"
        onClick={handleSubmit(onSubmit)}
      />
    </form>
  );
};

export default SignUpForm;
