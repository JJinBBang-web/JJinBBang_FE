// API 인터페이스 작성

export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}