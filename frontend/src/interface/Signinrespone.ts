export interface UserData {
  id: string;
  fname: string;
  lname: string;
  email: string;
  profile_pic: string;
  iat: number;
  exp: number;
}

export interface SigninResponse {
  message: string;
  token: string;
}