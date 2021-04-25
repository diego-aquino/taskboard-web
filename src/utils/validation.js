import * as yup from 'yup';

const validationMessages = {
  requiredField: 'Este é um campo obrigatório',
  invalidEmail: 'Forneça um email válido',
  passwordTooShort: 'A senha deve ter no mínimo 8 caracteres',
};

export async function requiredTextField(textValue) {
  return yup
    .string()
    .required(validationMessages.requiredField)
    .validate(textValue);
}

export async function requiredPasswordField(passwordValue, minLength) {
  return yup
    .string()
    .required(validationMessages.requiredField)
    .min(minLength, validationMessages.passwordTooShort)
    .validate(passwordValue);
}

export async function requiredEmailField(emailValue) {
  return yup
    .string()
    .email(validationMessages.invalidEmail)
    .required(validationMessages.requiredField)
    .validate(emailValue);
}
