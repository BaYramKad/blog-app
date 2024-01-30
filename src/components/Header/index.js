import React from 'react';
import styles from './Header.module.scss';
import { Button } from 'antd';
import { Link, NavLink } from 'react-router-dom';
import { LoginUserHeader } from '../LogInUserHeader';
import { getToken } from '../../api/api';

export function Header({ isLoggedIn, userData, onLogOutUser }) {
  const isAuth = getToken();
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <NavLink to="/articles/">
          <h2>Realworld Blog</h2>
        </NavLink>
      </div>

      {isAuth ? (
        <LoginUserHeader userData={userData} onLogOut={onLogOutUser} />
      ) : (
        <div className={styles.auth_buttons}>
          <Link to="/sign-in">
            <Button type="text">Sign In</Button>
          </Link>
          <Link to="/sign-up">
            <Button className={styles.sign_up_button}>Sign Up</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
