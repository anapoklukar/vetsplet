import { Employee } from './employee';

export interface Clinic {
  _id: string;
  owner: string;
  name: string;
  address: string;
  telNumber: string;
  email: string;
  description: string;
  employees: Employee[];
}
