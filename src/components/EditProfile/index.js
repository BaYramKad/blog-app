import React from 'react';
import { useForm } from 'react-hook-form';

import styles from '../SignUp/SignUp.module.scss';
import { useHistory } from 'react-router-dom';
import { ArticlesApi } from '../../api/articlesApi';

const apiUser = new ArticlesApi();

const EditProfile = ({ dataUserUpdate, onSetNewUserData }) => {
  const history = useHistory();
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setError,
  } = useForm({
    mode: 'onChange',
  });

  const onHandleSubmited = (data) => {
    const { username, email, password, avatar } = data;
    const requestData = {
      username,
      email,
      password,
      image: avatar,
    };
    apiUser
      .updateCurrentUser(requestData)
      .then((res) => {
        onSetNewUserData(res);
        history.push('/articles/');
      })
      .catch((err) => {
        if (err.message.includes('email')) {
          setError('email', {
            type: 'email',
            message: err.message,
          });
        }
        if (err.message.includes('username')) {
          setError('username', {
            type: 'username',
            message: err.message,
          });
        }
      });
  };

  return (
    <div className={styles.sign_up}>
      <form onSubmit={handleSubmit(onHandleSubmited)}>
        <span>Edit Profile</span>
        <label htmlFor="username">
          Username
          <input
            id="username"
            placeholder="Username"
            defaultValue={dataUserUpdate?.user?.username}
            className={(!isValid && errors?.username?.message && styles.not_valid) || ''}
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
            defaultValue={dataUserUpdate?.user?.email}
            placeholder="john@example.com"
            className={(!isValid && errors?.email?.message && styles.not_valid) || ''}
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
          New password
          <input
            id="password"
            type="password"
            placeholder="password"
            className={(!isValid && errors?.password?.message && styles.not_valid) || ''}
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

        <label htmlFor="avatar">
          Avatar image (url)
          <input
            id="avatar"
            type="url"
            placeholder="Avatar image"
            className={(!isValid && errors?.avatar?.message && styles.not_valid) || ''}
            {...register('avatar', {
              pattern: {
                value:
                  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
                message: 'Avatar должен быть в url формате',
              },
            })}
          />
        </label>
        <div className={styles.errors}>{errors?.avatar && <p>{errors?.avatar?.message}</p>}</div>

        <input value="Save" type="submit" disabled={!isValid} />
      </form>
    </div>
  );
};

export default EditProfile;
