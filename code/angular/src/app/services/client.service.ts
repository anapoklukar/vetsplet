import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Clinic } from '../models/clinic';
import { Appointment } from '../models/appointment';
import { Patient } from '../models/patient';
import { Client } from '../models/client';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientService {

  private baseUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getClient(id: string): Observable<any> {
    const url = `${this.baseUrl}/clients/${id}`;
    return this.httpClient.get(url);
  }

  getAppointments(): Observable<any>{
    const url = `${this.baseUrl}/appointments`;
    return this.httpClient.get(url);
  }

  getClinics(): Observable<any>{
    const url = `${this.baseUrl}/clinics`;
    return this.httpClient.get(url);
  }

 
  addAppointment(appointment: Object): Observable<any>{
    const url = `${this.baseUrl}/appointments`;
    return this.httpClient.post(url, appointment);
  }

  getPatients(id: string): Observable<any>{
    const url = `${this.baseUrl}/clinics${id}`;
    return this.httpClient.get(url);
  }

  deletePatients(clientId: string, patientId : string): Observable<any>{
    const url = `${this.baseUrl}/patients/${clientId}/${patientId}`;
    return this.httpClient.delete(url);
  }

  addPatients(clientId: string, patient : Patient): Observable<any>{
    const url = `${this.baseUrl}/patients/${clientId}`;
    return this.httpClient.post(url, patient);
  }

  updateUser(clientId: string, user : Client): Observable<any>{
    const url = `${this.baseUrl}/patients/${clientId}`;
    return this.httpClient.put(url, user);
  }
}
