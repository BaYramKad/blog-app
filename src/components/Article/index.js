import React from 'react';

import styles from '../Articles/Article.module.scss';
import like from '../../assets/images/like.svg';
import unlike from '../../assets/images/unlike.svg';

import Markdown from 'react-markdown';
import { format } from 'date-fns';

import { useHistory } from 'react-router-dom';

export const Article = (props) => {
  const history = useHistory();
  const {
    title,
    favoritesCount,
    createdAt,
    body,
    author: { username, image },
    onArticleHandle,
    slug,
    tagList,
    favorited,
    onFavoriteArticle,
  } = props;

  let idKey = [...tagList].length;
  const tags = tagList
    .filter((item) => item.length)
    .map((item) => <span key={idKey--}>{item}</span>);

  const onFavorite = () => {
    const token = localStorage.getItem('token');

    if (token) {
      onFavoriteArticle(favorited, slug);
    } else {
      history.push('/sign-up');
    }
  };
  return (
    <li>
      <article className={styles.article}>
        <div className={styles.article_info}>
          <div className={styles.article_title_info}>
            <h3 onClick={() => onArticleHandle(slug)}>{title}</h3>
            <div className={styles.favorite_btn} onClick={onFavorite}>
              <img src={favorited ? like : unlike} />
              <span>{favoritesCount}</span>
            </div>
            <div className={styles.article_tags}>{tags}</div>
          </div>
          <div className={styles.profile_info_article}>
            <div>
              <h2>{username}</h2>
              <span>{format(createdAt, 'MMMM dd, yyyy')}</span>
            </div>
            <img className={styles.article_avatar} src={image} />
          </div>
        </div>
        <div className={styles.article_body}>
          <Markdown>{body}</Markdown>
        </div>
      </article>
    </li>
  );
};
