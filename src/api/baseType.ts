// API 인터페이스 작성

export type BaseResponse<T> = {
  code: number;
  message: string;
  data: T;
};