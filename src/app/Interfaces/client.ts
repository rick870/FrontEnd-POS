export interface ClientRequest {
  name: string;
  email: string;
  documentTypeId: number;
  documentNumber: string;
  address: string;
  phone: string;
  state: number;
}

export interface ClientResponse {
  clientId: number;
  name: string;
  email: string;
  documentType: string;
  documentNumber: string;
  address: string;
  phone: string;
  auditCreateDate: string;
  state: number;
  stateClient: string;
}

export interface ClientListResponse {
  totalRecords: number;
  items: ClientResponse[];
}