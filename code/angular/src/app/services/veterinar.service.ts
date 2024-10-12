import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clinic } from '../models/clinic';
import { environment } from '../../environments/environment';
import {Appointment} from "../models/appointment";

@Injectable({ providedIn: 'root' })
export class VeterinarService {
  private baseUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}
  getEmployee(employeeId: any, clinicId: any): Observable<any> {
    const url = `${this.baseUrl}/employees/${clinicId}/${employeeId}`;
    return this.httpClient.get(url)
  }

  getAppointments(): Observable<any>{
    const url = `${this.baseUrl}/appointments`;
    return this.httpClient.get(url);
  }

  getClient(id: string): Observable<any> {
    const url = `${this.baseUrl}/clients/${id}`;
    return this.httpClient.get(url);
  }

  getAllClients(): Observable<any> {
    const url = `${this.baseUrl}/clients`;
    return this.httpClient.get(url);
  }

  getClinic(clinicId: any): Observable<any> {
    const url = `${this.baseUrl}/clinics/${clinicId}`;
    return this.httpClient.get(url);
  }

  getPatients(id: string): Observable<any>{
    const url = `${this.baseUrl}/patients/${id}`;
    return this.httpClient.get(url);
  }

  createAppointment(object: object): Observable<any> {
    const url = `${this.baseUrl}/appointments`;
    return this.httpClient.post(url, object);
  }

  deleteAppointment(id: string): Observable<any>{
    const url = `${this.baseUrl}/appointments/${id}`;
    return this.httpClient.delete(url);
  }

  updateEmployee(clinicId: string, employeeId: string, obj: object): Observable<any>{
    const url = `${this.baseUrl}/employees/${clinicId}/${employeeId}`;
    return this.httpClient.put(url, obj);
  }

  confirmEmployee(clinicId: string, employeeId: string): Observable<any>{
    const url = `${this.baseUrl}/employees/confirm/${clinicId}/${employeeId}`;
    return this.httpClient.put(url, null);
  }

  updateAppointment(appId: string, body: object): Observable<any>{
    const url = `${this.baseUrl}/appointments/${appId}`;
    return this.httpClient.put(url, body);
  }

  deleteEmployee(clinicId: string, employeeId: string): Observable<any>{
    const url = `${this.baseUrl}/employees/${clinicId}/${employeeId}`;
    return this.httpClient.delete(url);
  }
}