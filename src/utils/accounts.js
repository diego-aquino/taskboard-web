import api from '~/api';

import * as errors from './errors';

async function retryIfAccessTokenExpired(
  callback,
  refreshToken,
  { applyAccessToken },
) {
  try {
    const response = await callback();
    return response;
  } catch (error) {
    const errorType = errors.getNetworkErrorType(error.response);

    if (errorType === errors.types.ACCESS_TOKEN_EXPIRED) {
      const newAccessToken = await token(refreshToken);
      applyAccessToken?.(newAccessToken);
      return callback(newAccessToken);
    }

    throw error;
  }
}

function generateHeaders(accessToken) {
  return { Authorization: `Bearer ${accessToken}` };
}

export async function signup(accountData) {
  const signUpResponse = await api.post('/accounts/signup', accountData);
  const signUpData = signUpResponse.data;

  return signUpData;
}

export async function token(refreshToken) {
  const tokenResponse = await api.post('/accounts/token', { refreshToken });
  const { accessToken } = tokenResponse.data;

  return accessToken;
}

export async function details(accessToken, refreshToken, { applyAccessToken }) {
  const requestDetails = async (activeAccessToken = accessToken) => {
    const detailsResponse = await api.get('/accounts/details', {
      headers: generateHeaders(activeAccessToken),
    });
    const { account: accountData } = detailsResponse.data;

    return accountData;
  };

  return retryIfAccessTokenExpired(requestDetails, refreshToken, {
    applyAccessToken,
  });
}
