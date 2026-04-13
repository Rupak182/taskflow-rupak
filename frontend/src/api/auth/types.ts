export interface UserModelResponse {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponseModel {
  token: string;
  user: UserModelResponse;
}

export interface UserCreateModel {
  name: string;
  email: string;
  password?: string;
}

export interface UserLoginModel {
  email: string;
  password?: string;
}
