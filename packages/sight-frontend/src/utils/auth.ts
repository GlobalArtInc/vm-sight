const tokenKey = 'accessToken';

export function setToken (token: string) {
  return localStorage.setItem(tokenKey, token);
}

export function getToken () {
  return localStorage.getItem(tokenKey);
}

export function removeToken () {
  return localStorage.removeItem(tokenKey);
}
