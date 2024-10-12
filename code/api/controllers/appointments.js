const mongoose = require("mongoose");
const Appointment = mongoose.model("Appointment");
const Client = mongoose.model("Client");
const Clinic = mongoose.model("Clinic");

/**
 * @openapi
 *  /appointments:
 *    get:
 *      summary: Get all appointments
 *      description: Get all appointments.
 *      tags: [Appointment]
 *      responses:
 *        '200':
 *          description: <b>OK</b>, successful response, with all appointments.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Appointment'
 *        '404':
 *          description: <b>Not Found</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Appointments not found"
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Internal Server Error.
 */

const appointmentsReadAll = async (req, res) => {
  try {
    const appointments = await Appointment.find().exec();
    if (!appointments || appointments.length === 0) {
      res.status(404).json({
        message: "Appointments not found",
      });
    } else {
      res.status(200).json(appointments);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 *  /appointments:
 *    post:
 *      summary: Add a new appointment
 *      description: Add a new appointment.
 *      tags: [Appointment]
 *      security:
 *        - jwt: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Appointment'
 *            example:
 *              vetAppId: 1
 *              grAppId: 1
 *              date: 18.05.2024
 *              dateCreated: 01.05.2024
 *              doctorsNote: Annual check-up
 *              clientId: 1
 *              patientId: 1
 *              clinicId: 1
 *              employeeId: 1
 *        required:
 *          - clientId
 *          - patientId
 *          - clinicId
 *          - employeeId
 *      responses:
 *        '201':
 *          description: <b>Created</b>, successful response, with the newly created appointment.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Appointment'
 *              example:
 *                vetAppId: 1
 *                grAppId: 1
 *                date: 18.05.2024
 *                dateCreated: 01.05.2024
 *                doctorsNote: Annual check-up
 *                clientId: 1
 *                patientId: 1
 *                clinicId: 1
 *                employeeId: 1
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Body parameters 'date', 'clientId', 'patientId', 'clinicId' and 'employeeId' are required."
 *        '401':
 *          description: <b>Unauthorized</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: No authorization token was found.
 *        '404':
 *          description: <b>Not Found</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                  message: "Client with id '1' not found."
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Internal Server Error.
 */

const appointmentsAddOne = async (req, res) => {
  if (
    !req.body.clientId ||
    !req.body.patientId ||
    !req.body.clinicId ||
    !req.body.employeeId
  ) {
    res.status(400).json({
      message:
        "Body parameters 'clientId', 'patientId', 'clinicId' and 'employeeId' are required.",
    });
    return;
  }
  try {
    // making sure that the client, patient, clinic and  employee exist
    const client = await Client.findById(req.body.clientId).exec();
    if (!client) {
      res.status(404).json({
        message: `Client with id '${req.body.clientId}' not found.`,
      });
      return;
    }

    const patient = client.patients.id(req.body.patientId);
    if (!patient) {
      res.status(404).json({
        message: `Patient with id '${req.body.patientId}' not found.`,
      });
      return;
    }

    // find the clinic
    const clinic = await Clinic.findById(req.body.clinicId).exec();
    if (!clinic) {
      res.status(404).json({
        message: `Clinic with id '${req.body.clinicId}' not found.`,
      });
      return;
    }

    // find the employee
    const employee = clinic.employees.id(req.body.employeeId);
    if (!employee) {
      res.status(404).json({
        message: `Employee with id '${req.body.employeeId}' not found.`,
      });
      return;
    }

    const newAppointment = new Appointment(req.body);
    newAppointment.status = "pending"; // default status is "pending"
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 *   /appointments/{appointmentId}:
 *     get:
 *      summary: Get a single appointment.
 *      description: Get a single appointment.
 *      tags: [Appointment]
 *      parameters:
 *        - in: path
 *          name: appointmentId
 *          schema:
 *            type: string
 *          required: true
 *          description: The appointment id
 *          example: 1
 *      responses:
 *        '200':
 *          description: <b>OK</b>, successful response, read the appointment.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Appointment'
 *              example:
 *                vetAppId: 1
 *                grAppId: 1
 *                date: 18.05.2024
 *                dateCreated: 01.05.2024
 *                doctorsNote: Annual check-up
 *                clientId: 1
 *                patientId: 1
 *                clinicId: 1
 *                employeeId: 1
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Appointment id is required.
 *        '404':
 *          description: <b>Not Found</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Appointment with id '1' not found.
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Internal Server Error.
 */

const appointmentsReadOne = async (req, res) => {
  if (!req.params.appointmentId) {
    res.status(400).json({
      message: "Appointment id is required.",
    });
    return;
  }
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.appointmentId,
    }).exec();

    if (!appointment) {
      res.status(404).json({
        message: `Appointment with id '${req.params.appointmentId}' not found.`,
      });
    } else {
      res.status(200).json(appointment);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 *   /appointments/{appointmentId}:
 *    put:
 *      summary: Update an appointment.
 *      description: Update an appointment.
 *      tags: [Appointment]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: appointmentId
 *          schema:
 *            type: string
 *          required: true
 *          description: The appointment id
 *          example: 1
 *      requestBody:
 *        description: Appointment object that needs to be updated.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Appointment'
 *            example:
 *              vetAppId: 1
 *              grAppId: 1
 *              date: 18.05.2024
 *              dateCreated: 01.05.2024
 *              doctorsNote: Annual check-up
 *              clientId: 1
 *              patientId: 1
 *              clinicId: 1
 *              employeeId: 1
 *          required:
 *            - date
 *            - clientId
 *            - patientId
 *            - clinicId
 *            - employeeId
 *      responses:
 *        '200':
 *          description: <b>OK</b>, successful response, with the updated appointment.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Appointment'
 *              example:
 *                vetAppId: 1
 *                grAppId: 1
 *                date: 30.05.2024 // updated date
 *                dateCreated: 05.05.2024 // updated dateCreated
 *                doctorsNote: Annual check-up
 *                clientId: 1
 *                patientId: 1
 *                clinicId: 1
 *                employeeId: 1
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Appointment id is required."
 *        '401':
 *          description: <b>Unauthorized</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "No authorization token was found."
 *        '404':
 *          description: <b>Not Found</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Appointment with id '1' not found.
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Internal Server Error.
 */

const appointmentsUpdateOne = async (req, res) => {
  if (!req.params.appointmentId) {
    res.status(400).json({
      message: "Appointment id is required.",
    });
    return;
  }
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.appointmentId,
    }).exec();

    if (!appointment) {
      res.status(404).json({
        message: `Appointment with id '${req.params.appointmentId}' not found`,
      });
    } else {
      // check that atleast one thing is being updated
      if (
        !req.body.vetAppId &&
        !req.body.grAppId &&
        !req.body.dateCreated &&
        !req.body.date &&
        !req.body.doctorsNote &&
        !req.body.clientId &&
        !req.body.patientId &&
        !req.body.clinicId &&
        !req.body.employeeId &&
        !req.body.dateCreated
      ) {
        res.status(400).json({
          message:
            "One of the body parameters 'vetAppId', 'grAppId', 'dateCreated', 'date', 'doctorsNote', 'clientId', 'patientId', 'clinicId', 'dateCreated' and 'employeeId' is required.",
        });
        return;
      }
      // we can update only the attributes that are null
      if (req.body.vetAppId && appointment.vetAppId) {
        res.status(400).json({
          message: "vetAppId is already set.",
        });
        return;
      }

      if (req.body.grAppId && appointment.grAppId) {
        res.status(400).json({
          message: "grAppId is already set.",
        });
        return;
      }

      if (req.body.date && appointment.date) {
        res.status(400).json({
          message: "date is already set.",
        });
        return;
      }

      if (req.body.doctorsNote && appointment.doctorsNote) {
        res.status(400).json({
          message: "doctorsNote is already set.",
        });
        return;
      }

      if (req.body.clientId && appointment.clientId) {
        res.status(400).json({
          message: "clientId is already set.",
        });
        return;
      }

      if (req.body.patientId && appointment.patientId) {
        res.status(400).json({
          message: "patientId is already set.",
        });
        return;
      }

      if (req.body.clinicId && appointment.clinicId) {
        res.status(400).json({
          message: "clinicId is already set.",
        });
        return;
      }

      if (req.body.employeeId && appointment.employeeId) {
        res.status(400).json({
          message: "employeeId is already set.",
        });
        return;
      }

      Object.assign(appointment, req.body);
      await appointment.save();
      res.status(200).json(appointment);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 *  /appointments/{appointmentId}:
 *    delete:
 *      summary: Delete an appointment.
 *      description: Delete an appointment.
 *      tags: [Appointment]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: appointmentId
 *          schema:
 *            type: string
 *          required: true
 *          description: The appointment id
 *          example: 1
 *        - in: query
 *          name: clinicId
 *          schema:
 *            type: string
 *          required: true
 *          description: The clinic id
 *          example: 1
 *      responses:
 *        '204':
 *          description: <b>No Content</b>, successful response, with no body content.
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Appointment id is required.
 *        '401':
 *          description: <b>Unauthorized</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: No authorization token was found.
 *        '404':
 *          description: <b>Not Found</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Appointment with id '1' not found.
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Internal Server Error.
 */

const appointmentsDeleteOne = async (req, res) => {
  if (!req.params.appointmentId) {
    res.status(400).json({
      message: "Appointment id is required.",
    });
    return;
  }
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.appointmentId,
    }).exec();

    if (!appointment) {
      res.status(404).json({
        message: `Appointment with id '${req.params.appointmentId}' not found`,
      });
    } else {
      await appointment.deleteOne();
      res.status(204).json(appointment);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const confirmAppointment = async (req, res) => {
  if (!req.params.appointmentId) {
    res.status(400).json({
      message: "Appointment id is required.",
    });
    return;
  }
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.appointmentId,
    }).exec();

    if (!appointment) {
      res.status(404).json({
        message: `Appointment with id '${req.params.appointmentId}' not found`,
      });
    } else {
      appointment.status = "confirmed";
      await appointment.save();
      res.status(200).json(appointment);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  appointmentsReadAll,
  appointmentsAddOne,
  appointmentsReadOne,
  appointmentsUpdateOne,
  appointmentsDeleteOne,
  confirmAppointment
};
