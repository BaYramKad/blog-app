import React from 'react';

import { Link } from 'react-router-dom';
import avatarDefault from '../../assets/images/profile_img.png';
import { Button } from 'antd';

import styles from '../Header/Header.module.scss';

export const LoginUserHeader = ({ userData = {}, onLogOut }) => {
  const onLogOutUserHandle = () => {
    localStorage.removeItem('token');
    onLogOut(true);
  };

  const imgUrl = !userData.user?.image ? avatarDefault : userData.user?.image;
  return (
    <div className={styles.auth_buttons}>
      <Link className={styles.create_article} to="/new-article">
        <Button type="text">Create article</Button>
      </Link>

      <div className={styles.profile_info_article}>
        <Link to="/profile">
          <span className={styles.username}>{userData.user?.username}</span>
          <img className={styles.article_avatar} src={imgUrl} />
        </Link>
      </div>
      <Link to="/articles" onClick={onLogOutUserHandle}>
        <Button className={styles.sign_up_button}>Log Out</Button>
      </Link>
    </div>
  );
};
