export interface TokenRequestDto {
  Username: string;
  Password: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  data: string;
  message: string;
}