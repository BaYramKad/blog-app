import React, { useEffect, useState } from 'react';

import { Route, useRouteMatch, useHistory } from 'react-router-dom';
import { Header } from './components/Header';

import { ArticlesApi } from './api/articlesApi';

import { PaginationBlock } from './components/Pagination';
import { ArticleDitails } from './components/ArticleDitails';
import { CreateArticle } from './components/CreateArticle';
import { Spinner } from './assets/Spinner';

import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import EditProfile from './components/EditProfile';
import Articles from './components/Articles';

const api = new ArticlesApi();

const App = () => {
  const [atricles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [articlesCount, setArticlesCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [editedArticle, setEditedArtile] = useState(false);

  const routeMath = useRouteMatch('/articles/:id');
  const routeMathArticles = useRouteMatch('/articles/');
  const routeMathMain = useRouteMatch('/');
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (isLoggedIn) {
      localStorage.setItem('token', userData.user.token);
    } else if (token) {
      setLoading(true);
      api.checkIsLoggedInUser(token).then((res) => {
        setIsLoggedIn(true);
        setUserData(res);
        setLoading(false);
      });
    } else {
      history.push('/articles/');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setLoading(true);
    api.getAllArticles(page).then((res) => {
      setArticles(res.articles);
      setArticlesCount(res.articlesCount);
      setLoading(false);
    });
  }, [page]);

  const chengeArticles = (response) => {
    return atricles.map((item) => {
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
    const token = localStorage.getItem('token');
    if (favorited) {
      api.updateAnArticleForFavorite(slug, token).then((res) => {
        const favArticle = chengeArticles(res);
        setArticles(favArticle);
        const res2 = { ...res };
        api.updateAnArticleForFavorite(slug, token, res2);
      });
    } else {
      api.favoriteAnArticle(slug, token).then((res) => {
        const favArticle = chengeArticles(res);
        setArticles(favArticle);
        const res2 = { ...res };
        api.updateAnArticleForFavorite(slug, token, res2);
      });
    }
  };

  const onSetNewUserData = (data) => setUserData(data);

  const articlesReady = loading ? (
    <Spinner />
  ) : (
    <Articles aticles={atricles} onFavoriteArticle={onFavoriteArticle} />
  );

  const setNewArticle = (newArticle) => {
    const obj = newArticle.article;
    setArticles((prev) => {
      return [...prev, obj];
    });
  };

  const deleteArticle = (slug) => {
    const deleteFilterArticle = atricles.filter((item) => item.slug !== slug);
    setArticles(deleteFilterArticle);
  };

  const onEditArticle = (slug) => {
    setEditedArtile(true);
    history.push(`/articles/${slug}/edit`);
  };

  return (
    <div className="app">
      <Header
        userData={userData}
        isLoggedIn={isLoggedIn}
        onLogOutUser={(isLogOut) => setIsLoggedIn(isLogOut)}
      />

      <Route path="/" exact render={() => <div className="articles">{articlesReady}</div>} />
      <Route
        path="/articles/"
        exact
        render={() => <div className="articles">{articlesReady}</div>}
      />
      <Route
        path="/articles/:id"
        exact
        render={() => (
          <ArticleDitails
            userData={userData}
            id={routeMath?.params.id}
            articleDitales={atricles}
            deleteArticle={deleteArticle}
            onEditArticle={onEditArticle}
            onFavoriteArticle={onFavoriteArticle}
          />
        )}
      />
      <Route path="/sign-up" render={() => <SignUp />} />
      <Route
        path="/sign-in"
        render={() => (
          <SignIn
            onUserData={(useData) => setUserData(useData)}
            onLoggedIn={(isLogged) => setIsLoggedIn(isLogged)}
          />
        )}
      />
      <Route
        path="/profile"
        render={() => <EditProfile dataUserUpdate={userData} onSetNewUserData={onSetNewUserData} />}
      />
      <Route
        path="/new-article"
        render={() => <CreateArticle setNewArticle={setNewArticle} userData={userData} />}
      />
      <Route
        path="/articles/:id/edit"
        render={() => (
          <CreateArticle
            editedArticle={editedArticle}
            setNewArticle={setNewArticle}
            userData={userData}
          />
        )}
      />

      {(routeMathArticles?.isExact || routeMathMain?.isExact) && !loading && (
        <PaginationBlock page={page} setPage={setPage} articlesCount={articlesCount} />
      )}
    </div>
  );
};
export default App;
