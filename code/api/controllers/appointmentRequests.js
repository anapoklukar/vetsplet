const mongoose = require('mongoose');
const Appointment = mongoose.model('Appointment');
const AppointmentRequest = mongoose.model('AppointmentRequest');

/**
 * @openapi
 *  /appointmentRequests:
 *    get:
 *      summary: Get all appointment requests.
 *      description: Get all appointment requests.
 *      tags: [AppointmentRequest]
 *      responses:
 *        '200':
 *          description: <b>OK</b>, with a list of appointment requests.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AppointmentRequest'
 *        '404':
 *          description: <b>Not Found</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: No appointment requests found.
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Internal Server Error.
 */
const appointmentRequestsReadAll = async (req, res) => {
    try {
        let appointmentRequests = await mongoose.model("AppointmentRequest").find();
        if (!appointmentRequests || appointmentRequests.length == 0) {
          res.status(404).json({
            message: "No appointment requests found",
          });
        } else {
          res.status(200).json(appointmentRequests);
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
};

/**
 * @openapi
 *  /appointmentRequests:
 *    post:
 *      summary: Add a new appointment request.
 *      description: Add a new appointment request.
 *      tags: [AppointmentRequest]
 *      security:
 *        - jwt: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AppointmentRequest'
 *            example:
 *              appointmentId: 3m4n5b6v7c8x9z
 *              message: I would like to book an operation for my dog.
 *        required:
 *          - appointmentId
 *          - message
 *      responses:
 *        '201':
 *          description: <b>Created</b>, successful response, with the newly created appointment request.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AppointmentRequest'
 *              example:
 *                appointmentId: 03m4n5b6v7c8x9z
 *                message: I would like to book an operation for my dog.
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Body parameters 'appointmentId' and 'message' are required.
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
 *                  message: Appointment with id '03m4n5b6v7c8x9z' not found
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Internal Server Error.
 */
const appointmentRequestsAddOne = async (req, res) => {
    if (
        !req.body.appointmentId||
        !req.body.message
      ) {
        res.status(400).json({
          message:
            "Body parameters 'appointmentId' and 'message' are required.",
        });
        return;
      }
      try {
        // making sure that the appointment exists
        const appointment = await Appointment.findById(req.body.appointmentId).exec();
        if (!appointment) {
          res.status(404).json({
            message: `Appointment with id '${req.body.appointmentId}' not found`,
          });
          return;
        }
    
        const newAppointmentRequest = new AppointmentRequest(req.body);
        const savedAppointmentRequest = await newAppointmentRequest.save();
        res.status(201).json(savedAppointmentRequest);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

/**
 * @openapi
 *   /appointmentRequests/{appointmentRequestId}:
 *     get:
 *      summary: Get a single appointment request.
 *      description: Get a single appointment request.
 *      tags: [AppointmentRequest]
 *      parameters:
 *        - in: path
 *          name: appointmentRequestId
 *          schema:
 *            type: string
 *          required: true
 *          description: The appointment request id.
 *          example: 03m4n5b6v7c8x9z
 *      responses:
 *        '200':
 *          description: <b>OK</b>, successful response, with the appointment request.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AppointmentRequest'
 *              example:
 *                appointmentId: 03m4n5b6v7c8x9z
 *                message: I would like to book an operation for my dog.
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Appointment request id is required.
 *        '404':
 *          description: <b>Not Found</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Appointment request with id '03m4n5b6v7c8x9z' not found
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Internal Server Error.
 */
const appointmentRequestsReadOne = async (req, res) => {
    try {
        const appointmentRequest = await mongoose
          .model("AppointmentRequest")
          .findById(req.params.appointmentRequestId)
          .exec();
        if (!appointmentRequest) {
          res.status(404).json({
            message: `Appointment request with id '${req.params.appointmentRequestId}' not found`,
          });
        } else {
          res.status(200).json(appointmentRequest);
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

/**
 * @openapi
 *   /appointmentRequests/{appointmentRequestId}:
 *    put:
 *      summary: Update an appointment request.
 *      description: Update an appointment request.
 *      tags: [AppointmentRequest]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: appointmentRequestId
 *          schema:
 *            type: string
 *          required: true
 *          description: The appointment request id.
 *          example: 1
 *      requestBody:
 *        description: The appointment request object to update.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AppointmentRequest'
 *            example:
 *              appointmentId: 1
 *              message: I would like to book an operation for my dog.
 *      responses:
 *        '200':
 *          description: <b>OK</b>, successful response, with the updated appointment request.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Appointment'
 *              example:
 *                appointmentId: 1
 *                message: I would like to book an operation for my cat.
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Body parameters 'appointmentId' or 'message' are required.
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
 *                message: Appointment request with id '1' not found
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Internal Server Error.
 */
const appointmentRequestsUpdateOne = async (req, res) => {
    if (
        !req.body.appointmentId||
        !req.body.message
      ) {
        res.status(400).json({
          message:
            "Body parameters 'appointmentId' and 'message' are required.",
        });
        return;
      }
      try {
    
        const appointmentRequest = await mongoose
          .model("AppointmentRequest")
          .findById(req.params.appointmentRequestId)
          .exec();
        if (!appointmentRequest) {
          res.status(404).json({
            message: `Appointment request with id '${req.params.appointmentRequestId}' not found`,
          });
          return;
        }
    
        appointmentRequest.appointmentId = req.body.appointmentId;
        appointmentRequest.message = req.body.message;
        const savedAppointmentRequest = await appointmentRequest.save();
        res.status(200).json(savedAppointmentRequest);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

/**
 * @openapi
 *  /appointmentRequests/{appointmentRequestId}:
 *    delete:
 *      summary: Delete an appointment request.
 *      description: Delete an appointment request.
 *      tags: [AppointmentRequest]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: appointmentRequestId
 *          schema:
 *            type: string
 *          required: true
 *          description: The appointment request id.
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
const appointmentRequestsDeleteOne = async (req, res) => {
    try {
        const appointmentRequest = await mongoose
          .model("AppointmentRequest")
          .findById(req.params.appointmentRequestId)
          .exec();
        if (!appointmentRequest) {
          res.status(404).json({
            message: `Appointment request with id '${req.params.appointmentRequestId}' not found`,
          });
          return;
        }
    
        await appointmentRequest.remove();
        res.status(204).json(null);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

module.exports = {
    appointmentRequestsReadAll,
    appointmentRequestsAddOne,
    appointmentRequestsReadOne,
    appointmentRequestsUpdateOne,
    appointmentRequestsDeleteOne,
};