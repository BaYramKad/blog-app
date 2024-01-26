import React from 'react';

import { format } from 'date-fns';
import styles from '../ArticleDitails/ArticaleDitales.module.scss';
import avatarDefault from '../../assets/images/profile_img.png';

export const AuthorComponent = ({ username, createdAt = '', image = avatarDefault }) => {
  return (
    <div className={styles.profile_info_article}>
      <div>
        <h2>{username}</h2>
        {createdAt && <span>{format(createdAt, 'MMMM dd, yyyy')}</span>}
      </div>
      {image && <img className={styles.article_avatar} src={image} alt="avatar" />}
    </div>
  );
};
