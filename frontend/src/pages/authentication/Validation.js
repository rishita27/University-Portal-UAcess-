/**
@author [Rushit Jasoliya](rushit.jasoliya@dal.ca)
@description This file is to include different frontend validations, used in other files.

*/

export const NameValidation = (value) => {
  const name = /^[A-Za-z ]+$/;
  if (value.match(name)) {
    return true;
  }
  return false;
};

export const EmailValidation = (value) => {
  const email = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (value.match(email)) {
    return true;
  }
  return false;
};

export const PasswordValidation = (value) => {
  const password =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
  if (value.match(password)) {
    return true;
  }
  return false;
};

export const CodeValidation = (value) => {
  const code = /^[0-9]+$/;
  if (value.match(code)) {
    return true;
  }
  return false;
};
