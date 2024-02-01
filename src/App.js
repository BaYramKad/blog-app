import React, { Suspense, lazy, useEffect, useState } from 'react';

import { Route, useRouteMatch, Switch } from 'react-router-dom';

import { ArticlesApi } from './api/articlesApi';

import { PaginationBlock } from './components/Pagination';
import { Spinner } from './assets/Spinner';

const ArticleDitails = lazy(() => import('./components/ArticleDitails'));
const CreateArticle = lazy(() => import('./components/CreateArticle'));
const SignUp = lazy(() => import('./components/SignUp'));
const SignIn = lazy(() => import('./components/SignIn'));
const EditProfile = lazy(() => import('./components/EditProfile'));
const Articles = lazy(() => import('./components/Articles'));
const Header = lazy(() => import('./components/Header'));
const NotFound = lazy(() => import('./components/NotFound'));

const api = new ArticlesApi();

const App = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [articlesCount, setArticlesCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [editedArticle, setEditedArtile] = useState(false);
  const [errors, setError] = useState(null);

  const routeMath = useRouteMatch('/articles/:id');
  const routeMathArticles = useRouteMatch('/articles/');
  const routeMathMain = useRouteMatch('/');

  useEffect(() => {
    setLoading(true);
    api.checkIsLoggedInUser().then((res) => {
      setIsLoggedIn(true);
      setUserData(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getAllArticles(page).then((res) => {
      setArticles(res.articles);
      setArticlesCount(res.articlesCount);
      setLoading(false);
    });
  }, [page]);

  const setNewArticle = (newArticle) => {
    const obj = newArticle.article;
    setArticles((prev) => {
      return [...prev, obj];
    });
  };

  const logOut = (isLogOut) => {
    setIsLoggedIn(isLogOut);
    setUserData(null);
  };

  const catchError = (error) => {
    setError(error);
    setLoading(false);
  };

  const articlesReady = loading ? (
    <Spinner />
  ) : (
    <Suspense fallback={<Spinner />}>
      <Articles
        articles={articles}
        onFavoriteArticleFunc={(favArticles) => setArticles(favArticles)}
      />
    </Suspense>
  );
  return (
    <div className="app">
      <Suspense fallback={<Spinner />}>
        <Header userData={userData} onLogOutUser={logOut} />
      </Suspense>

      <Switch>
        <Route path="/" exact render={() => <div className="articles">{articlesReady}</div>} />
        <Route
          path="/articles/"
          exact
          render={() => {
            return (
              <Suspense fallback={<Spinner />}>
                <div className="articles">{articlesReady}</div>
              </Suspense>
            );
          }}
        />
        <Route
          path="/articles/:id"
          exact
          render={() => (
            <Suspense fallback={<Spinner />}>
              <ArticleDitails
                id={routeMath?.params.id}
                onDeleteArticle={(newArticles) => setArticles(newArticles)}
                onEditArticle={(isEdit) => setEditedArtile(isEdit)}
                isLoggedIn={isLoggedIn}
                catchError={catchError}
                articles={articles}
                onFavoriteArticleFunc={(favArticles) => setArticles(favArticles)}
              />
            </Suspense>
          )}
        />
        <Route
          path="/sign-up"
          exact
          render={() => (
            <Suspense fallback={<Spinner />}>
              <SignUp />
            </Suspense>
          )}
        />
        <Route
          path="/sign-in"
          exact
          render={() => (
            <Suspense fallback={<Spinner />}>
              <SignIn
                onUserData={(useData) => setUserData(useData)}
                onLoggedIn={(isLogged) => setIsLoggedIn(isLogged)}
              />
            </Suspense>
          )}
        />

        <Route
          path="/profile"
          render={() => (
            <Suspense fallback={<Spinner />}>
              <EditProfile
                dataUserUpdate={userData}
                onSetNewUserData={(data) => setUserData(data)}
              />
            </Suspense>
          )}
        />
        <Route
          path="/new-article"
          exact
          render={() => (
            <Suspense fallback={<Spinner />}>
              <CreateArticle setNewArticle={setNewArticle} />
            </Suspense>
          )}
        />
        <Route
          path="/articles/:id/edit"
          exact
          render={() => (
            <Suspense fallback={<Spinner />}>
              <CreateArticle editedArticle={editedArticle} setNewArticle={setNewArticle} />
            </Suspense>
          )}
        />
        <Route
          path="*"
          render={() => (
            <Suspense fallback={<Spinner />}>
              <NotFound errors={errors} />
            </Suspense>
          )}
        />
      </Switch>

      {(routeMathArticles?.isExact || routeMathMain?.isExact) && !loading && (
        <PaginationBlock page={page} setPage={setPage} articlesCount={articlesCount} />
      )}
    </div>
  );
};
export default App;
