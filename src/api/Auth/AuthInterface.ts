import { BaseResponse } from "../interface";

export interface signupRequest {
  oauthProvider: "kakao" | "google" | "naver",
  oauthCode: string
}
export interface signupResponse extends BaseResponse<{
  accessToken: string,
  refreshToken: string,
}> { }

export interface sendEmailCodeRequest {
  emailAddress: string
}
export interface sendEmailCodeResponse extends BaseResponse<null> { }

export interface verifyEmailCodeRequest {
  emailAddress: string,
  authCode: string
}
export interface verifyEmailCodeResponse extends BaseResponse<null> { }

export interface logoutResponse extends BaseResponse<null> { }

export interface deleteUserResponse extends BaseResponse<null> { }

