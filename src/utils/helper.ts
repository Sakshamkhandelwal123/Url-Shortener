import { Logger } from '@nestjs/common';
import { passwordStrength } from 'check-password-strength';
import { get } from 'lodash';
import { BreachOfPasswordPolicyError, WeakPasswordError } from './error';

export const getErrorCodeAndMessage = (
  error: unknown,
  { log }: { log: boolean } = { log: true },
): { code: string; message: string } => {
  if (log) {
    Logger.error(error);
  }

  return {
    code: get(error, 'code', get(error, 'response.code', 'SYSTEM_ERROR')),
    message: get(
      error,
      'message',
      get(error, 'response.message', 'Internal Server Error'),
    ),
  };
};

function checkUpperCase(inputString: string) {
  return /[A-Z]/.test(inputString);
}

function checkLowerCase(inputString: string) {
  return /[a-z]/.test(inputString);
}

function checkNumber(inputString: string) {
  return /\d/.test(inputString);
}

function checkSpecialCharacter(inputString: string) {
  const format = /[`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
  return format.test(inputString);
}

export function validatePassword(inputString: string) {
  if (
    checkLowerCase(inputString) &&
    checkUpperCase(inputString) &&
    checkNumber(inputString) &&
    checkSpecialCharacter(inputString)
  ) {
    return true;
  }

  return false;
}

export const validatePasswordStrength = (password: string) => {
  if (passwordStrength(password).id === 0) {
    throw new WeakPasswordError();
  }

  if (
    (password.length < 8 ||
      password.length > 64 ||
      validatePassword(password) === false) === true
  ) {
    throw new BreachOfPasswordPolicyError();
  }
};

export const getSanitizedUrl = (url: string) => {
  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }

  if (!url.startsWith('https://')) {
    url = 'https://' + url;
  }

  return url;
};
