import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from '../Interfaces/user';

@Injectable({ providedIn: 'root' })
export class UserService {

  private myApiUrl: string = environment.endPoint + 'User';

  constructor(private http: HttpClient) {}

  // POST /api/User/Register — usa FormData por la imagen
  register(data: any): Observable<BaseResponse<any>> {
    const formData = new FormData();
    formData.append('UserName', data.UserName);
    formData.append('Password', data.Password);
    formData.append('Email', data.Email);
    formData.append('State', data.State.toString());
    if (data.Image) {
      formData.append('Image', data.Image);
    }
    return this.http.post<BaseResponse<any>>(this.myApiUrl + '/Register', formData);
  }
}