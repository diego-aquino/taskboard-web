export const errorTypes = {
  EMAIL_ALREADY_IN_USE: 'EMAIL_ALREADY_IN_USE',
  ACCESS_TOKEN_EXPIRED: 'ACCESS_TOKEN_EXPIRED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

const errorMessageToErrorType = {
  'Email is already in use.': errorTypes.EMAIL_ALREADY_IN_USE,
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
    case errorTypes.UNKNOWN_ERROR:
      return 'Oops! Ocorreu um erro';
    default:
      return null;
  }
}
