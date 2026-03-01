import { BaseResponse } from "../baseType";

export type signupRequest = {
  oauthProvider: "kakao" | "google" | "naver";
  oauthCode: string;
};

export type signupResponse = BaseResponse<{
  accessToken: string;
  refreshToken: string;
}>;

export type sendEmailCodeRequest = {
  emailAddress: string;
};

export type sendEmailCodeResponse = BaseResponse<null>;

export type verifyEmailCodeRequest = {
  emailAddress: string;
  authCode: string;
};

export type verifyEmailCodeResponse = BaseResponse<null>;

export type logoutResponse = BaseResponse<null>;

export type deleteUserResponse = BaseResponse<null>;
