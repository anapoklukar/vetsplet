import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../models/client';
import { Employee } from '../models/employee';
import { Clinic } from '../models/clinic';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private baseUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  registerClient(client: Client): Observable<any> {
    const url = `${this.baseUrl}/clients`;
    return this.httpClient.post(url, client);
  }
  registerEmployee(employee: Employee): Observable<any> {
    const url = `${this.baseUrl}/employees`;
    return this.httpClient.post(url, employee);
  }

  login(loginForm: any): Observable<any> {
    const url = `${this.baseUrl}/login`;
    return this.httpClient.post(url, loginForm);
  }

  registerClinic(clinic: Clinic): Observable<any> {
    const url = `${this.baseUrl}/clinics`;
    return this.httpClient.post(url, clinic);
  }
}
