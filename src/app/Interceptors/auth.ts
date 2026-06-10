export interface TokenRequestDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  data: string;
  message: string;
}