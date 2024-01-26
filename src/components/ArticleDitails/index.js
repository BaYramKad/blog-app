import React from 'react';

import styles from './ArticaleDitales.module.scss';
import like from '../../assets/images/like.svg';
import Markdown from 'react-markdown';
import { AuthorComponent } from '../AuthorComponent';

export const ArticleDitails = ({ id, articleDitales }) => {
  if (!articleDitales.props.aticles?.length) return '...';
  const article = articleDitales.props.aticles.find((item) => item.slug === id);

  const {
    title,
    favoritesCount,
    createdAt,
    body,
    author: { username, image },
    tagList,
  } = article;

  let idKey = [...tagList].length;
  const tags = tagList
    .filter((item, i) => item.length && i < 10)
    .map((item) => <span key={idKey--}>{item}</span>);
  return (
    <article className={styles.article}>
      <div className={styles.article_info}>
        <div>
          <h3>{title}</h3>
          <div>
            <img src={like} />
            <span>{favoritesCount}</span>
          </div>
          <div className={styles.article_full_tags}>{tags}</div>
        </div>
        <AuthorComponent createdAt={createdAt} username={username} image={image} />
      </div>
      <p className={styles.article_body}>
        <Markdown>{body}</Markdown>
      </p>
    </article>
  );
};
