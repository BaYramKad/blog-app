export class ArticlesApi {
  baseURL = 'https://blog.kata.academy/api/';
  getAllArticles = async (page) => {
    const url = new URL(`${this.baseURL}articles`);
    url.searchParams.append('limit', 10);
    url.searchParams.append('offset', page);
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
}
