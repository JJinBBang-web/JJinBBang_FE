import { postAPI, deleteAPI } from "../baseAPI";
import { signupRequest, signupResponse, sendEmailCodeRequest, sendEmailCodeResponse, verifyEmailCodeRequest, verifyEmailCodeResponse, logoutResponse, deleteUserResponse } from "./AuthInterface";

export class AuthAPI {
  /**
   * 회원가입 API
   * @param {signupRequest} params - 회원가입 요청
   * @returns {Promise<signupResponse>} 회원가입 응답
   */
  static async signup(params: signupRequest): Promise<signupResponse> {
    try {
      const response = await postAPI("/api/v1/auth/signup", params);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 이메일 인증코드 전송 API
   * @param {sendEmailCodeRequest} params - 이메일 인증 코드 전송 요청
   * @returns {Promise<sendEmailCodeResponse>} 이메일 인증 코드 전송 응답
   */
  static async sendEmailCode(params: sendEmailCodeRequest): Promise<sendEmailCodeResponse> {
    try {
      const response = await postAPI("/api/v1/auth/emailCode", params, true);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 이메일 인증코드 확인 API
   * @param {verifyEmailCodeRequest} params - 이메일 인증 코드 확인 요청
   * @returns {Promise<verifyEmailCodeResponse>} 이메일 인증 코드 확인 응답
   */
  static async verifyEmailCode(params: verifyEmailCodeRequest): Promise<verifyEmailCodeResponse> {
    try {
      const response = await postAPI("/api/v1/auth/emailCode/verify", params, true);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 로그아웃 API
   * @returns {Promise<logoutResponse>} 로그아웃 응답
   */
  static async logout(): Promise<logoutResponse> {
    try {
      const response = await deleteAPI("/api/v1/auth/logout", true);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 사용자 삭제 API
   * @returns {Promise<deleteUserResponse>} 사용자 삭제 응답
   */
  static async deleteUser(): Promise<deleteUserResponse> {
    try {
      const response = await deleteAPI("/api/v1/auth/deleteUser", true);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

