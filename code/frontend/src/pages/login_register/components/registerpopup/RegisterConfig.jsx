
export const formFields = {
  username: {
    margin: "normal",
    required: true,
    fullWidth: true,
    id: "username",
    name: "username",
    autoComplete: "username",
    autoFocus: true,
    placeholder: "Username",
  },
  email: {
    margin: "normal",
    required: true,
    fullWidth: true,
    id: "email",
    name: "email",
    type: "email",
    autoComplete: "email",
    placeholder: "Email Address",
  },
  password: {
    margin: "normal",
    required: true,
    fullWidth: true,
    name: "password",
    type: "password",
    id: "password",
    autoComplete: "current-password",
    placeholder: "Password",
  },
};

export const formTitle = {
  login: "Login",
  register: "Registrati",
}
