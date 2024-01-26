import React, { useEffect, useState } from 'react';

import { Header } from './components/Header';
import Articles from './components/Articles';
import { ArticlesApi } from './api/articlesApi';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { PaginationBlock } from './components/Pagination';

import { Route, useRouteMatch, useHistory } from 'react-router-dom';
import { ArticleDitails } from './components/ArticleDitails';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import EditProfile from './components/EditProfile';

const api = new ArticlesApi();

const App = () => {
  const [atricles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [articlesCount, setArticlesCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

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

  const onSetNewUserData = (data) => setUserData(data);

  const spinner = (
    <div className="atricle-spin">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
    </div>
  );
  const articlesReady = loading ? spinner : <Articles aticles={atricles} />;

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
        render={() => <ArticleDitails id={routeMath?.params.id} articleDitales={articlesReady} />}
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

      {(routeMathArticles?.isExact || routeMathMain?.isExact) && !loading && (
        <PaginationBlock page={page} setPage={setPage} articlesCount={articlesCount} />
      )}
    </div>
  );
};
export default App;
