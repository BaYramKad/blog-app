import React from 'react';
import { useForm } from 'react-hook-form';

import styles from '../SignUp/SignUp.module.scss';
import { NavLink, useHistory } from 'react-router-dom';
import { ArticlesApi } from '../../api/articlesApi';

const api = new ArticlesApi();

const SignIn = ({ onLoggedIn, onUserData }) => {
  const history = useHistory();
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setError,
  } = useForm({
    mode: 'onChange',
  });

  const onHandleSubmit = (data) => {
    api
      .loginUser(data)
      .then((res) => {
        onLoggedIn(true);
        onUserData(res);
        history.push('/articles/');
      })
      .catch((err) => {
        setError('email', {
          type: 'email',
          message: err.message,
        });
      });
  };

  return (
    <div className={styles.sign_up}>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <span>Sign In</span>
        <label htmlFor="email">
          Email
          <input
            id="email"
            placeholder="Email"
            type="email"
            className={!isValid && errors?.email?.message && styles.not_valid}
            {...register('email', {
              required: 'Поле обязательно к заполнению',
              pattern:
                /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu,
            })}
          />
        </label>
        <div className={styles.errors}>
          {errors?.email && <p>{errors?.email?.message || 'Не верный формат Email'}</p>}
        </div>

        <label htmlFor="password">
          Password
          <input
            id="password"
            placeholder="Password"
            type="password"
            className={!isValid && errors?.password?.message && styles.not_valid}
            {...register('password', {
              required: 'Поле обязательно к заполнению',
              minLength: {
                value: 6,
                message: 'Минимум 6 символов',
              },
              maxLength: {
                value: 40,
                message: 'Максимум 20 символов',
              },
            })}
          />
        </label>
        <div className={styles.errors}>
          {errors?.password && <p>{errors?.password?.message}</p>}
        </div>

        <input value="Login" type="submit" disabled={!isValid} />

        <p>
          Don’t have an account ? <NavLink to="/sign-up">Sign Up</NavLink>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
