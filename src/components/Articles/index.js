import React from 'react';
import styles from './Article.module.scss';
import { Article } from '../Article';
import { withRouter } from 'react-router-dom';

const Articles = ({ history, aticles, onFavoriteArticle }) => {
  return (
    <div className={styles.articles_list}>
      <ul>
        {aticles?.map((art) => {
          return (
            <Article
              key={art.slug}
              {...art}
              onArticleHandle={(slug) => {
                history.push(`/articles/${slug}`);
              }}
              onFavoriteArticle={onFavoriteArticle}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default withRouter(Articles);
