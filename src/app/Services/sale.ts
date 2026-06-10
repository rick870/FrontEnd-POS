import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SaleService {
  private http = inject(HttpClient);
  private apiUrl = environment.endPoint + 'Sale';
  private clientUrl = environment.endPoint + 'Client';
  private productUrl = environment.endPoint + 'Product';

  getList(params: {
    NumPage?: number;
    NumRecordsPage?: number;
    StateFilter?: number;
    TextFilter?: string;
    NumFilter?: number;
    StartDate?: string;
    EndDate?: string;
  }): Observable<any> {
    const query: any = {
      NumPage: params.NumPage ?? 1,
      NumRecordsPage: params.NumRecordsPage ?? 10,
    };

    if (params.TextFilter) {
      query.TextFilter = params.TextFilter;
      query.NumFilter = 1;
    }

    if (params.StartDate) query.StartDate = params.StartDate;
    if (params.EndDate) query.EndDate = params.EndDate;

    const queryString = new URLSearchParams(
      Object.entries(query).map(([k, v]) => [k, String(v)])
    ).toString();

    return this.http.get<any>(`${this.apiUrl}?${queryString}`);
  }

  getById(saleId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${saleId}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Register`, data);
  }

  cancel(saleId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Cancel/${saleId}`, {});
  }

  getClients(): Observable<any> {
    return this.http.post<any>(this.clientUrl, {
      numPage: 1,
      numRecordsPage: 100,
      textFilter: '',
      stateFilter: 1  // ← solo activos
    });
  }

  getProducts(textFilter: string = ''): Observable<any> {
    return this.http.post<any>(this.productUrl, {
      numPage: 1, numRecordsPage: 100,
      textFilter, stateFilter: 1
    });
  }
}