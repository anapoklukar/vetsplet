const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

/**
 * @openapi
 * components:
 *  schemas:
 *   Employee:
 *    type: object
 *    description: Information about employees.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>unique identifier</b> of employee
 *      example: 635a62f5dc5d7968e68464be
 *     name:
 *      type: string
 *      description: <b>name/b> of the employee
 *      example: Angela
 *     surname:
 *      type: string
 *      description: <b>surname</b> of the employee
 *     telNumber:
 *      type: string
 *      description: <b>telNumber</b> of the employee
 *      example: 069-152-954
 *     email:
 *      type: string
 *      description: <b>email</b> of the employee
 *      example: angela.stopar@gmail.com
 *     username:
 *      type: string
 *      description: <b>username</b> of the employee
 *      example: angela_stopar
 *     password:
 *      type: string
 *      description: <b>password</b> of the employee
 *      example: IloveAnimals123
 *     clinic:
 *      type: string
 *      description: <b>clinic</b> of the employee
 *      example: Domači Vet
 *     status:
 *      type: string
 *      description: <b>status</b> of the employee
 *      example: pending
 *     isOwner:
 *      type: boolean
 *      description: is the employee <b>owner</b> of the clinic
 *      example: true
 *    required:
 *     - profession
 *     - name
 *     - surname
 *     - telNumber
 *     - email
 *     - username
 *     - password
 *     - clinic
 *     - status
 *     - isOwner
 */

const employeeSchema = mongoose.Schema({
  profession: { type: String, required: [true, "Profession is required!"] },
  name: { type: String, required: [true, "Name is required!"] },
  surname: { type: String, required: [true, "Surname is required!"] },
  telNumber: {
    type: String,
    required: [true, "Telephone number is required!"],
  },
  email: { type: String, required: [true, "Email is required!"] }, // email is unique
  username: { type: String, required: [true, "Username is required!"] }, // username is unique
  password: { type: String, required: [true, "Password is required!"] },
  salt: { type: String},
  clinic: { type: String, required: [true, "Clinic is required!"] },
  status: { type: String, required: [true, "Status is required!"] },
  isOwner: { type: Boolean, required: [true, "isOwner is required!"] },
});

employeeSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign(
    {
      _id: this._id,
      clinic: this.clinic,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.JWT_SECRET,
  );
};

/**
 * @openapi
 * components:
 *  schemas:
 *   Clinic:
 *    type: object
 *    description: Information about clinics.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>unique identifier</b> of clinic
 *      example: 635a62f5dc5d7968e68464be
 *     owner:
 *      type: string
 *      description: <b>name/b> of the owner of the clinic
 *      example: Taylor Swift
 *     name:
 *      type: string
 *      description: <b>name</b> of the clinic
 *      example: Domači Vet
 *     address:
 *      type: string
 *      description: <b>address</b> of the clinic
 *      example: Cesta 1, 1000 Ljubljana
 *     telNumber:
 *      type: string
 *      description: <b>telNumber</b> of the clinic
 *      example: 069-152-954
 *     email:
 *      type: string
 *      description: <b>email</b> of the clinic
 *      example: domacivet@gmail.com
 *     description:
 *      type: string
 *      description: <b>description</b> of the clinic
 *      example: Domači Vet je veterinarska ambulanta, ki se nahaja v Ljubljani.
 *     employees:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/Employee'
 *    required:
 *     - owner
 *     - name
 *     - address
 *     - telNumber
 *     - email
 *     - description
 */

const clinicSchema = mongoose.Schema({
  owner: { type: String, required: [true, "Owner is required!"] },
  name: { type: String, required: [true, "Name is required!"] }, // name is unique
  address: { type: String, required: [true, "Address is required!"] },
  telNumber: {
    type: String,
    required: [true, "Telephone number is required!"],
  },
  email: { type: String, required: [true, "Email is required!"] }, // email is unique
  description: { type: String, required: [true, "Description is required!"] },
  employees: [employeeSchema],
});

mongoose.model("Clinic", clinicSchema);

/**
 * @openapi
 * components:
 *  schemas:
 *   Patient:
 *    type: object
 *    description: Information about patient.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>unique identifier</b> of patient
 *      example: 635a62f5dc5d7968e68464be
 *     name:
 *      type: string
 *      description: <b>name/b> of the patient
 *      example: Rex
 *     age:
 *      type: number
 *      description: <b>age</b> of the patient
 *      example: 5
 *     gender:
 *      type: string
 *      description: <b>gender</b> of the patient
 *      example: "moški"
 *     passportId:
 *      type: string
 *      description: <b>passportId</b> of the patient
 *      example: 123456789
 *     chip:
 *      type: boolean
 *      description: if the patient has a <b>chip</b>
 *      example: true
 *     species:
 *      type: string
 *      description: <b>species</b> of the patient
 *      example: pes
 *     breed:
 *      type: string
 *      description: <b>breed</b> of the patient
 *      example: nemški ovčar
 *     clinic:
 *      type: string
 *      description: <b>clinic</b> of the patient
 *      example: Domači Vet
 *     assignedEmployee:
 *      type: string
 *      description: <b>assignedEmployee</b> of the patient
 *      example: Angela Stopar
 *    required:
 *     - name
 *     - age
 *     - gender
 */

const patientSchema = mongoose.Schema({
  name: { type: String, required: [true, "Name is required!"] }, // name is unique for a client
  age: { type: Number, required: [true, "Age is required!"] },
  gender: { type: String, required: [true, "Gender is required!"] },
  passportId: { type: String },
  chip: { type: Boolean },
  species: { type: String },
  breed: { type: String },
  clinic: { type: String }, // name of the clinic
  assignedEmployee: { type: String }, // the name of the assigned employee
});

/**
 * @openapi
 * components:
 *  schemas:
 *   Client:
 *    type: object
 *    description: Information about client.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>unique identifier</b> of client
 *      example: 635a62f5dc5d7968e68464be
 *     name:
 *      type: string
 *      description: <b>name/b> of the client
 *      example: Blaž
 *     surname:
 *      type: string
 *      description: <b>surname</b> of the client
 *      example: Grilj
 *     telNumber:
 *      type: string
 *      description: <b>telNumber</b> of the client
 *      example: 069-152-954
 *     email:
 *      type: string
 *      description: <b>email</b> of the client
 *      example: blazgrilj@gmail.com
 *     username:
 *      type: string
 *      description: <b>username</b> of the client
 *      example: blazgrilj
 *     password:
 *      type: string
 *      description: <b>password</b> of the client
 *      example: IloveAnimals123
 *     patients:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/Patient'
 *    required:
 *     - name
 *     - surname
 *     - telNumber
 *     - email
 *     - username
 *     - password
 */

const clientSchema = mongoose.Schema({
  name: { type: String, required: [true, "Name is required!"] },
  surname: { type: String, required: [true, "Surname is required!"] },
  telNumber: {
    type: String,
    required: [true, "Telephone number is required!"],
  },
  email: { type: String, required: [true, "Email is required!"] }, // email is unique
  username: { type: String, required: [true, "Username is required!"] }, // username is unique
    password: { type: String, required: [true, "Password is required!"] },
    salt: { type: Number},
  patients: [patientSchema],
  ethAddress: { type: String },
  ethRole: { type: String },
});

clientSchema.methods.generateJwt = function () {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign(
    {
      _id: this._id,
      exp: parseInt(expiry.getTime() / 1000),
    },
    process.env.JWT_SECRET,
  );
};

mongoose.model("Client", clientSchema);

/**
 * @openapi
 * components:
 *  schemas:
 *   Appointment:
 *    type: object
 *    description: Information about appointment.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>unique identifier</b> of appointment
 *      example: 635a62f5dc5d7968e68464be
 *     vetAppId:
 *      type: number
 *      description: <b>vetAppId</b> of the appointment
 *      example: 1
 *     grAppId:
 *      type: number
 *      description: <b>grAppId</b> of the appointment
 *      example: 1
 *     date:
 *      type: string
 *      description: <b>date</b> of the appointment
 *      example: 2021-06-21
 *     dateCreated:
 *      type: string
 *      description: <b>dateCreated</b> of the appointment
 *      example: 2021-06-20
 *     doctorsNote:
 *      type: string
 *      description: <b>doctorsNote</b> of the appointment
 *      example: Annual check-up
 *     clientId:
 *      type: string
 *      description: <b>clientId</b> of the appointment
 *      example: 635a62f5dc5d7968e68464be
 *     patientId:
 *      type: string
 *      description: <b>patientId</b> of the appointment
 *      example: 635a62f5dc5d7968e68464be
 *     clinicId:
 *      type: string
 *      description: <b>clinicId</b> of the appointment
 *      example: 635a62f5dc5d7968e68464be
 *     employeeId:
 *      type: string
 *      description: <b>employeeId</b> of the appointment
 *      example: 635a62f5dc5d7968e68464be
 *     status:
 *      type: string
 *      description: <b>status</b> of the appointment
 *      example: pending
 *    required:
 *     - date
 *     - clientId
 *     - patientId
 *     - clinicId
 *     - employeeId
 */

const appointmentSchema = mongoose.Schema({
  vetAppId: { type: Number },
  grAppId: { type: Number },
  date: { type: String },
  dateCreated: { type: String },
  doctorsNote: { type: String },
  clientId: { type: String, required: [true, "Client is required!"] },
  patientId: { type: String, required: [true, "Patient is required!"] },
  clinicId: { type: String, required: [true, "Clinic is required!"] },
  employeeId: { type: String, required: [true, "Employee is required!"] },
  status: { type: String, required: [true, "Status is required!"]}
});

mongoose.model("Appointment", appointmentSchema);

/**
 * @openapi
 * components:
 *  schemas:
 *   Transaction:
 *    type: object
 *    description: Information about eth transaction.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>unique identifier</b> of transaction
 *      example: 635a62f5dc5d7968e68464be
 *     clientId:
 *      type: string
 *      description: <b>clientId</b> of the transaction
 *      example: 635a62f5dc5d7968e68464be
 *     transactionHash:
 *      type: string
 *      description: <b>transaction_hash</b> of the transaction
 *      example: 0x1c5a62f5dc5d7968e68464be
 *     action:
 *      type: string
 *      description: <b>action</b> of the transaction
 *      example: create
 *     date:
 *      type: string
 *      description: <b>date</b> of the transaction
 *      example: 2021-06-21T12:19:16.000Z
 *    required:
 *     - clientId
 *     - transactionHash
 *     - action
 *     - date
 */

const transactionSchema = mongoose.Schema({
  clientId: { type: String, required: [true, "Client is required!"] },
  transactionHash: { type: String, required: [true, "Transaction hash is required!"] },
  action: { type: String, required: [true, "Action is required!"] },
  date: { type: String, required: [true, "Date is required!"] },
});

mongoose.model("Transaction", transactionSchema);

/**
 * @openapi
 * components:
 *  schemas:
 *   AppointmentRequest:
 *    type: object
 *    description: Information about appointment request.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>unique identifier</b> of appointment request
 *      example: 635a62f5dc5d7968e68464be
 *     appointmentId:
 *      type: string
 *      description: <b>appointmentId</b> of the appointment that is requested
 *      example: 635a62f5dc5d7968e68464be
 *     message:
 *      type: string
 *      description: <b>message</b> of the appointment request
 *      example: I would like to schedule an operation for my dog.
 *    required:
 *     - appointmentId
 *     - message
 */
const appointmentRequestSchema = mongoose.Schema({
  appointmentId: { type: String, required: [true, "Appointment is required!"] },
  message: { type: String, required: [true, "Message is required!"] }
});

mongoose.model("AppointmentRequest", appointmentRequestSchema);
