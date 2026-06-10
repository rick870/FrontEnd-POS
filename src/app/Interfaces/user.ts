export interface UserRequestDto {
  UserName: string;
  Password: string;
  Email: string;
  Image?: File | null;
  State: number;
}

export interface BaseResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string;
}