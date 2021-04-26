import api from '~/api';

export async function signup(accountData) {
  const signUpResponse = await api.post('/accounts/signup', accountData);
  const signUpData = signUpResponse.data;

  return signUpData;
}
