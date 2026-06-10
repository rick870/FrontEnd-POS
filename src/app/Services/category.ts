import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private myApiUrl: string = environment.endPoint + 'Category';

  constructor(private http: HttpClient) { }

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

    return this.http.post<any>(this.myApiUrl, body);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.myApiUrl + '/Register', data);
  }

  edit(id: number, data: any): Observable<any> {
    return this.http.put<any>(this.myApiUrl + '/Edit/' + id, data);
  }

  remove(id: number): Observable<any> {
    return this.http.put<any>(this.myApiUrl + '/Remove/' + id, {});
  }
}