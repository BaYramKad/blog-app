import React from 'react';
import styles from './Article.module.scss';
import { Article } from '../Article';
import { withRouter } from 'react-router-dom';
import { ArticlesApi } from '../../api/articlesApi';

const api = new ArticlesApi();

const Articles = ({ history, articles, onFavoriteArticleFunc }) => {
  const chengeArticles = (response) => {
    return articles.map((item) => {
      if (response.article.slug === item.slug) {
        return {
          ...item,
          favorited: response.article.favorited,
          favoritesCount: response.article.favoritesCount,
        };
      } else {
        return item;
      }
    });
  };

  const onFavoriteArticle = (favorited, slug) => {
    if (favorited) {
      api.unFavoriteAnArticle(slug).then((res) => {
        const favArticle = chengeArticles(res);
        onFavoriteArticleFunc(favArticle);
        const res2 = { ...res };
        api.updateAnArticleForFavorite(slug, res2);
      });
    } else {
      api.favoriteAnArticle(slug).then((res) => {
        const favArticle = chengeArticles(res);
        onFavoriteArticleFunc(favArticle);
        const res2 = { ...res };
        api.updateAnArticleForFavorite(slug, res2);
      });
    }
  };

  return (
    <div className={styles.articles_list}>
      <ul>
        {articles?.map((art) => {
          return (
            <Article
              key={`${art.slug}_${art.title}_${art.updatedAt}`}
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
