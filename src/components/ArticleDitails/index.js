import React, { useEffect, useState } from 'react';

import styles from './ArticaleDitales.module.scss';
import like from '../../assets/images/like.svg';
import unlike from '../../assets/images/unlike.svg';
import Markdown from 'react-markdown';
import { AuthorComponent } from '../AuthorComponent';
import { Buttons } from '../Buttons';
import { Spinner } from '../../assets/Spinner';
import { ArticlesApi } from '../../api/articlesApi';
import { useHistory } from 'react-router-dom';

const api = new ArticlesApi();

const ArticleDitails = ({
  id,
  isLoggedIn,
  articles,
  onDeleteArticle,
  onEditArticle,
  onFavoriteArticleFunc,
  catchError,
}) => {
  const [article, setCurrentArticle] = useState({});
  const [userData, setUserData] = useState({});
  const [loading, setIsLoading] = useState(true);

  const history = useHistory();

  const deleteArticle = (slug) => {
    const deleteFilterArticle = articles.filter((item) => item.slug !== slug);
    onDeleteArticle(deleteFilterArticle);
  };

  const editArticle = (slug) => {
    onEditArticle(true);
    history.push(`/articles/${slug}/edit`);
  };

  useEffect(() => {
    setIsLoading(true);

    if (!isLoggedIn) {
      api
        .getAnArticle(id)
        .then((res) => {
          setCurrentArticle(res.article);
          setIsLoading(false);
        })
        .catch((error) => {
          catchError(error);
        });
    } else {
      Promise.all([api.getAnArticle(id), api.checkIsLoggedInUser()]).then((res) => {
        const article = res.find((item) => item['article']);
        const user = res.find((item) => item['user']);
        setCurrentArticle(article.article);
        setUserData(user);
        setIsLoading(false);
      });
    }
  }, [id]);
  if (loading) return <Spinner />;

  let idKey = [...article.tagList].length;
  const tags = article.tagList
    .filter((item, i) => item.length && i < 10)
    .map((item) => <span key={idKey--}>{item}</span>);

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

  const onFavorite = () => {
    if (userData?.user?.username) {
      onFavoriteArticle(article.favorited, article.slug);
    } else {
      history.push('/sign-up');
    }
  };

  return (
    <article className={styles.article}>
      <div className={styles.article_info}>
        <div>
          <h3>{article.title}</h3>
          <div onClick={onFavorite}>
            <img src={article.favorited ? like : unlike} />
            <span>{article.favoritesCount}</span>
          </div>

          <div className={styles.article_full_tags}>{tags}</div>
        </div>
        <AuthorComponent
          createdAt={article.createdAt}
          username={article.author.username}
          image={article.author.image}
        />
        {article.author.username === userData?.user?.username ? (
          <Buttons
            onEditArticle={editArticle}
            deleteArticle={deleteArticle}
            userData={userData}
            slug={article.slug}
          />
        ) : null}
      </div>
      <div className={styles.article_body}>
        <Markdown>{article.body}</Markdown>
      </div>
    </article>
  );
};

export default ArticleDitails;
