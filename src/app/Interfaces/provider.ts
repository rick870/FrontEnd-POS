export interface DocumentType {
  documentTypeId: number;
  abbreviation: string;
  code: string;
  name: string;
}

export interface ProviderRequest {
  name: string;
  email: string;
  documentTypeId: number;
  documentNumber: string;
  address: string;
  phone: string;
  state: number;
}

export interface ProviderResponse {
  providerId: number;
  name: string;
  email: string;
  documentType: string;
  documentNumber: string;
  address: string;
  phone: string;
  auditCreateDate: string;
  state: number;
  stateProvider: string;
}

export interface ProviderListResponse {
  totalRecords: number;
  items: ProviderResponse[];
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string;
  errors: any;
}