import {Appointment} from "./appointment";
import {Client} from "./client";
import {Employee} from "./employee";
import {Patient} from "./patient";

export interface AppointmentData {
  appointment: Appointment
  client: Client
  employee: Employee

  patient: Patient
}