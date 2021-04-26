export const types = {
  EMAIL_ALREADY_IN_USE: 'EMAIL_ALREADY_IN_USE',
  ACCESS_TOKEN_EXPIRED: 'ACCESS_TOKEN_EXPIRED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

const errorMessageToErrorType = {
  'Email is already in use.': types.EMAIL_ALREADY_IN_USE,
  'Expired access token.': types.ACCESS_TOKEN_EXPIRED,
};

export function getNetworkErrorType(errorResponse) {
  const { message } = errorResponse.data;
  const errorType = errorMessageToErrorType[message] ?? types.UNKNOWN_ERROR;
  return errorType;
}

export function generateNetworkErrorMessage(errorType) {
  switch (errorType) {
    case types.EMAIL_ALREADY_IN_USE:
      return 'Email já em uso';
    case types.UNKNOWN_ERROR:
      return 'Oops! Ocorreu um erro';
    default:
      return null;
  }
}
