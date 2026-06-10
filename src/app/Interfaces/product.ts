export interface ProductRequest {
  code: string;
  name: string;
  stock: number;
  sellPrice: number;
  categoryId: number;
  providerId: number;
  state: number;
}

export interface ProductResponse {
  productId: number;
  code: string;
  name: string;
  stock: number;
  image: string;
  sellPrice: number;
  category: string;
  provider: string;
  categoryId: number;
  providerId: number;
  auditCreateDate: string;
  state: number;
  stateProduct: string;
}