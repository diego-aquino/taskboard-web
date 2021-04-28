export const errorTypes = {
  EMAIL_ALREADY_IN_USE: 'EMAIL_ALREADY_IN_USE',
  ACCESS_TOKEN_EXPIRED: 'ACCESS_TOKEN_EXPIRED',
  EMAIL_AND_PASSWORD_DO_NOT_MATCH: 'EMAIL_AND_PASSWORD_DO_NOT_MATCH',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

const errorMessageToErrorType = {
  'Email is already in use.': errorTypes.EMAIL_ALREADY_IN_USE,
  'Email and/or password do not match.':
    errorTypes.EMAIL_AND_PASSWORD_DO_NOT_MATCH,
  'Expired access token.': errorTypes.ACCESS_TOKEN_EXPIRED,
};

export function getErrorType(errorResponse) {
  const { message } = errorResponse.data;
  const errorType =
    errorMessageToErrorType[message] ?? errorTypes.UNKNOWN_ERROR;

  return errorType;
}

export function generateFeedbackMessage(errorType) {
  switch (errorType) {
    case errorTypes.EMAIL_ALREADY_IN_USE:
      return 'Email já em uso';
    case errorTypes.EMAIL_AND_PASSWORD_DO_NOT_MATCH:
      return 'Email e/ou senha não conferem';
    case errorTypes.UNKNOWN_ERROR:
      return 'Oops! Ocorreu um erro';
    default:
      return null;
  }
}
