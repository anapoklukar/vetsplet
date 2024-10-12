const express = require("express");
const router = express.Router();

const { expressjwt: jwt } = require("express-jwt");
const auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: "payload",
  algorithms: ["HS256"],
});

const ctrlEmployees = require("../controllers/employees");
const ctrlPatients = require("../controllers/patients");
const ctrlClients = require("../controllers/clients");
const ctrlAppointments = require("../controllers/appointments");
const ctrlClinics = require("../controllers/clinics");
const ctrlLogin = require("../controllers/login");
const ctrlTransactions = require("../controllers/transactions");
const ctrlAppointmentRequests = require("../controllers/appointmentRequests");

// Employee routes
router.get("/employees/:clinicId", ctrlEmployees.employeesReadAll);
router.post("/employees/", ctrlEmployees.employeesAddOne);
router.get("/employees/:clinicId/:employeeId", ctrlEmployees.employeesReadOne);
router.put(
  "/employees/:clinicId/:employeeId",
  auth,
  ctrlEmployees.employeesUpdateOne,
);
router.delete(
  "/employees/:clinicId/:employeeId",
  auth,
  ctrlEmployees.employeesDeleteOne,
);
router.put(
  "/employees/confirm/:clinicId/:employeeId",
  auth,
  ctrlEmployees.employeesConfirmOne,
);

// Patient routes
router.get("/patients/:clientId", ctrlPatients.patientsReadAll);
router.post("/patients/:clientId", auth, ctrlPatients.patientsAddOne);
router.get("/patients/:clientId/:patientId", ctrlPatients.patientsReadOne);
router.put(
  "/patients/:clientId/:patientId",
  auth,
  ctrlPatients.patientsUpdateOne,
);
router.delete(
  "/patients/:clientId/:patientId",
  auth,
  ctrlPatients.patientsDeleteOne,
);

// Client routes
router.get("/clients", ctrlClients.clientsReadAll);
router.post("/clients", ctrlClients.clientsAddOne);
router.get("/clients/:clientId", ctrlClients.clientsReadOne);
router.put("/clients/:clientId", auth, ctrlClients.clientsUpdateOne);
router.delete("/clients/:clientId", auth, ctrlClients.clientsDeleteOne);

// Appointment routes
router.get("/appointments", ctrlAppointments.appointmentsReadAll);
router.post("/appointments", auth, ctrlAppointments.appointmentsAddOne);
router.get(
  "/appointments/:appointmentId",
  ctrlAppointments.appointmentsReadOne,
);
router.put(
  "/appointments/:appointmentId",
  auth,
  ctrlAppointments.appointmentsUpdateOne,
);
router.delete(
  "/appointments/:appointmentId",
  auth,
  ctrlAppointments.appointmentsDeleteOne,
);
router.get(
  "/appointments/confirm/:appointmentId",
  ctrlAppointments.confirmAppointment,
);

// Clinics routes
router.get("/clinics", ctrlClinics.clinicsReadAll);
router.post("/clinics", ctrlClinics.clinicsAddOne);
router.get("/clinics/:clinicId", ctrlClinics.clinicsReadOne);
router.put("/clinics/:clinicId", auth, ctrlClinics.clinicsUpdateOne);
router.delete("/clinics/:clinicId", auth, ctrlClinics.clinicsDeleteOne);

// Login route
router.post("/login", ctrlLogin.login);

// Transaction routes
router.get("/transactions", ctrlTransactions.transactionsReadAll);
router.post("/transactions", auth, ctrlTransactions.transactionsAddOne);
router.get("/transactions/:transactionId", ctrlTransactions.transactionsReadOne);
router.put(
  "/transactions/:transactionId",
  auth,
  ctrlTransactions.transactionsUpdateOne,
);
router.delete(
  "/transactions/:transactionId",
  auth,
  ctrlTransactions.transactionsDeleteOne,
);

// Appointment request routes
router.get("/appointmentRequests", ctrlAppointmentRequests.appointmentRequestsReadAll);
router.post("/appointmentRequests", auth, ctrlAppointmentRequests.appointmentRequestsAddOne);
router.get(
  "/appointmentRequests/:appointmentRequestId",
  ctrlAppointmentRequests.appointmentRequestsReadOne,
);
router.put(
  "/appointmentRequests/:appointmentRequestId",
  auth,
  ctrlAppointmentRequests.appointmentRequestsUpdateOne,
);
router.delete(
  "/appointmentRequests/:appointmentRequestId",
  auth,
  ctrlAppointmentRequests.appointmentRequestsDeleteOne,
);

module.exports = router;
