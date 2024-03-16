import Vue from 'vue';
const tokenKey = 'accessToken';

export function setToken(token: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return Vue.$cookies.set(tokenKey, token);
}

export function getToken() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return Vue.$cookies.get(tokenKey);
}

export function removeToken() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return Vue.$cookies.remove(tokenKey);
}
