export interface IUser {
  name: string;
  jurisdiction?: string;
  barNumber?: string;
  email: string;
  createdAt: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ISignUp {
  name: string;
  jurisdiction?: string;
  barNumber?: string;
  email: string;
  password: string;
  confirm_password: string;
}
