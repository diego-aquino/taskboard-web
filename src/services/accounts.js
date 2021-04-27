import api from '~/api';

export async function signUp(accountData) {
  const signUpResponse = await api.post('/accounts/signup', accountData);
  const signUpData = signUpResponse.data;

  return signUpData;
}

export async function token(refreshToken) {
  const tokenResponse = await api.post('/accounts/token', { refreshToken });
  const { accessToken } = tokenResponse.data;

  return accessToken;
}

export async function details(accessToken) {
  const detailsResponse = await api.get('/accounts/details', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const { account: accountData } = detailsResponse.data;

  return accountData;
}
