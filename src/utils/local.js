export const localStorageKeys = {
  ACCOUNT_DATA: 'taskboard:account:data',
  ACCESS_TOKEN: 'taskboard:auth:accessToken',
  REFRESH_TOKEN: 'taskboard:auth:refreshToken',
};

const isClient = typeof window !== 'undefined';
const localStorageIsAvailable =
  isClient && typeof window.localStorage !== 'undefined';

export function saveToLocalStorage(key, value) {
  if (!localStorageIsAvailable) return;
  window.localStorage.setItem(key, value);
}

export function readFromLocalStorage(key) {
  if (!localStorageIsAvailable) return;
  window.localStorage.getItem(key);
}