export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
);
export const PASSWORD_REGEX_ERROR =
  'password must have a lowercase, A UPPERCASE, a number and a special characters ';
export const PASSWORD_REQUIRED_ERROR = 'Password is required';

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 10;
