export interface Patient {
  _id? : string
  name: string;
  age: number;
  gender: string;
  passportId?: string;
  chip: boolean;
  species?: string;
  breed?: string;
  clinic?: string;
  assignedEmployee?: string;
}
