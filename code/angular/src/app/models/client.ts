import { Patient } from './patient';

export interface Client {
  _id : string;
  name: string;
  surname: string;
  telNumber: string;
  email: string;
  username: string;
  password: string;
  patients: Patient[];
  ethAddress: string;
}
