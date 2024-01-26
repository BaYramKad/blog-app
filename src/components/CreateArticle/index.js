import React from 'react';
import { useForm } from 'react-hook-form';

import styles from './CreateArticle.module.scss';
import { Checkbox } from 'antd';
import { NavLink, useHistory } from 'react-router-dom';
import { ArticlesApi } from '../../api/articlesApi';

const apiUser = new ArticlesApi();

export const SignUp = () => {
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
    if (data.password === data.repeatPassword) {
      const { username, email, password } = data;
      const requestData = {
        username,
        email,
        password,
      };
      apiUser
        .registerUser(requestData)
        .then((res) => {
          history.push('/sign-in/');
        })
        .catch((err) => {
          if (err.message.includes('email')) {
            setError('email', {
              type: 'email',
              message: 'Такой Email уже существует',
            });
          }
          if (err.message.includes('username')) {
            setError('username', {
              type: 'username',
              message: 'Пользователь с таким username уже существует',
            });
          }
        });
    } else {
      setError('repeatPassword', {
        type: 'password',
        message: 'Passwords must match',
      });
    }
  };

  return (
    <div className={styles.sign_up}>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <span>Create new account</span>
        <label htmlFor="username">
          Username
          <input
            id="username"
            placeholder="Username"
            className={!isValid && errors?.username?.message && styles.not_valid}
            {...register('username', {
              required: 'Поле обязательно к заполнению',
              minLength: {
                value: 3,
                message: 'Минимум 3 символа',
              },
              maxLength: {
                value: 20,
                message: 'Максимум 20 символов',
              },
            })}
          />
        </label>
        <div className={styles.errors}>
          {errors?.username && <p>{errors?.username?.message || 'This is a required field'}</p>}
        </div>

        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            placeholder="Email"
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
            type="password"
            placeholder="password"
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

        <label htmlFor="repeatPassword">
          Repeat password
          <input
            id="repeatPassword"
            placeholder="Password"
            type="password"
            className={!isValid && errors?.repeatPassword?.message && styles.not_valid}
            {...register('repeatPassword', {
              required: 'Поле обязательно к заполнению',
            })}
          />
        </label>
        <div className={styles.errors}>
          {errors?.repeatPassword && <p>{errors?.repeatPassword?.message}</p>}
        </div>

        <div>
          <Checkbox checked className={styles.checkbox}>
            I agree to the processing of my personal information
          </Checkbox>
        </div>

        <input value="Create" type="submit" disabled={!isValid} />

        <p>
          Already have an account? <NavLink to="/sign-in">Sign In</NavLink>{' '}
        </p>
      </form>
    </div>
  );
};
