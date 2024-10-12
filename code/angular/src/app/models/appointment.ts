import { Client } from './client';
import { Employee } from './employee';
import { Patient } from './patient';

export interface Appointment {
    _id?: string;
    vetAppId?: number;
    grAppId?: number;
    dateCreated: string;
    date: string;
    doctorsNote?: string;
    clientId: string;
    patientId: string;
    clinicId: string;
    employeeId: string;

    status: string;
}

