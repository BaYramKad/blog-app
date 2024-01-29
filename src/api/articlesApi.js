export class ArticlesApi {
  baseURL = 'https://blog.kata.academy/api/';
  getAllArticles = async (page) => {
    const url = new URL(`${this.baseURL}articles`);
    url.searchParams.append('offset', page);
    url.searchParams.append('limit', 10);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };
  getAnArticle = async (slug) => {
    const url = new URL(`${this.baseURL}articles/${slug}`);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  registerUser = async (userObj) => {
    const url = new URL(`${this.baseURL}users`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userObj }),
    });
    const data = await response.json();
    console.log('data: ', data);
    if (data.errors) {
      const key = Object.entries(data.errors)[0][0];
      const value = Object.entries(data.errors)[0][1];
      if (data.errors[key] === value) {
        throw new Error(`${key} ${value}`);
      }
    }
    return data;
  };

  loginUser = async (userObj) => {
    const url = new URL(`${this.baseURL}users/login`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userObj }),
    });
    const data = await response.json();
    if (data.errors) {
      this.errorCheck(data);
    }
    return data;
  };

  errorCheck = (data) => {
    const key = Object.entries(data.errors)[0][0];
    const value = Object.entries(data.errors)[0][1];
    if (data.errors[key] === value) {
      throw new Error(`${key} ${value}`);
    }
  };

  checkIsLoggedInUser = async (token) => {
    const url = new URL(`${this.baseURL}user`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  };

  updateCurrentUser = async (dataUserUpdate, requestData) => {
    const url = new URL(`${this.baseURL}user`);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${dataUserUpdate.user.token}`,
      },
      body: JSON.stringify({ user: requestData }),
    });
    const data = await response.json();
    if (data.errors) {
      this.errorCheck(data);
    }
    return data;
  };

  createAnArticle = async (dataUser, dataCreateArticle) => {
    const url = new URL(`${this.baseURL}articles`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${dataUser.user.token}`,
      },
      body: JSON.stringify({ article: dataCreateArticle }),
    });
    const data = await response.json();
    if (data.errors) {
      this.errorCheck(data);
    }
    return data;
  };

  deleteAnArticle = async (slug, dataUser) => {
    const url = new URL(`${this.baseURL}articles/${slug}`);
    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${dataUser.user.token}`,
      },
    });
  };
  updateAnArticleForFavorite = async (slug, token, favoriteArticle) => {
    const url = new URL(`${this.baseURL}articles/${slug}`);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ article: { ...favoriteArticle.article } }),
    });
    const data = await response.json();
    return data;
  };
  updateAnArticle = async (dataUser, dataCreateArticle, slug) => {
    const url = new URL(`${this.baseURL}articles/${slug}`);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${dataUser.user.token}`,
      },
      body: JSON.stringify({ article: dataCreateArticle }),
    });
    const data = await response.json();
    if (data.errors) {
      this.errorCheck(data);
    }
    return data;
  };

  favoriteAnArticle = async (slug, token) => {
    const url = new URL(`${this.baseURL}articles/${slug}/favorite`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    return data;
  };
  unFavoriteAnArticle = async (slug, token) => {
    const url = new URL(`${this.baseURL}articles/${slug}/favorite`);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    return data;
  };
}
