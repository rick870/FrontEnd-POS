import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.endPoint + 'Product';
  private categoryUrl = environment.endPoint + 'Category/Select';
  private providerUrl = environment.endPoint + 'Provider';

  getList(filters: {
    numPage: number;
    numRecordsPage: number;
    textFilter: string;
    stateFilter: number;
  }): Observable<any> {
    const body: any = {
      numPage: filters.numPage,
      numRecordsPage: filters.numRecordsPage,
      textFilter: filters.textFilter
    };

    if (filters.stateFilter !== -1) {
      body.stateFilter = filters.stateFilter;
    }

    if (filters.textFilter && filters.textFilter.trim() !== '') {
      body.numFilter = 1;
    }

    return this.http.post<any>(this.apiUrl, body);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Register`, data);
  }

  edit(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Edit/${id}`, data);
  }

  remove(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Remove/${id}`, {});
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.categoryUrl);
  }

  getProviders(stateFilter: number = 1): Observable<any> {
    return this.http.post<any>(this.providerUrl, {
      numPage: 1,
      numRecordsPage: 100,
      textFilter: '',
      stateFilter: stateFilter
    });
  }
}