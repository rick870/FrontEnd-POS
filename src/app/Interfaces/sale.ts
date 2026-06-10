export interface SaleDetail {
  productId: number;
  quantity: number;
  unitSalePrice: number;
  total: number;
  // para mostrar en UI
  code?: string;
  name?: string;
  image?: string;
}

export interface SaleRequest {
  voucherNumber: string;
  observation: string;
  subTotal: number;
  igv: number;
  totalAmount: number;
  voucherDocumentTypeId: number;
  warehouseId: number;
  clientId: number;
  saleDetails: SaleDetail[];
}

export interface SaleResponse {
  saleId: number;
  voucherNumber: string;
  observation: string;
  subTotal: number;
  igv: number;
  totalAmount: number;
  clientId: number;
  clientName: string;
  dateOfSale: string;
  state: number;
  stateSale: string;
}