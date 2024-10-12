const mongoose = require("mongoose");
const Client = mongoose.model("Client");
const Clinic = mongoose.model("Clinic");

/**
 * @openapi
 * /patients/{clientId}:
 *    get:
 *     tags: [Patient]
 *     description: Use to request all patients of a client
 *     parameters:
 *      - in: path
 *        name: clientId
 *        schema:
 *         type: string
 *        required: true
 *        description: Id of the client
 *     responses:
 *      '200':
 *       description: <b>OK</b>, a successful response.
 *      '400':
 *       description: <b>Bad Request</b>, if the client id is not provided.
 *       content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *              message: "Client id is required."
 *      '404':
 *       description: <b>Not Found</b>, if the client with the given id is not found.
 *       content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *              message: "Client with id '5f9d5b9b9d9d975b9d9d975b' not found."
 *      '500':
 *       description: <b>Internal Server Error</b>, with an error message.
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *              message: "Internal Server Error."
 */

const patientsReadAll = async (req, res) => {
  if (!req.params.clientId) {
    res.status(400).json({
      message: "Client id is required.",
    });
    return;
  }
  const clientId = req.params.clientId;
  try {
    const client = await Client.findById(clientId).populate("patients").exec();
    if (!client) {
      res.status(404).json({
        message: `Client with id '${clientId}' not found`,
      });
      return;
    }

    // if client has no patients
    if (client.patients.length === 0) {
      res.status(404).json({ message: "Client has no patients." });
      return;
    }

    res.status(200).json(client.patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /patients/{clientId}:
 *   post:
 *    tags: [Patient]
 *    security:
 *      - jwt: []
 *    description: Add a new patient to a client.
 *    parameters:
 *     - in: path
 *       name: clientId
 *       schema:
 *        type: string
 *       required: true
 *       description: Id of the client
 *    requestBody:
 *      description: Patient object that needs to be added to the client.
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          $ref: '#/components/schemas/Patient'
 *         example:
 *          name: Bimi
 *          age: 4
 *          gender: female
 *          passportId: '123456789'
 *          chip: true
 *          species: dog
 *          breed: golden retriever
 *    responses:
 *      '201':
 *       description: <b>Created</b>, a successful response, returns the created patient.
 *       content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/Patient'
 *          example:
 *            message: Patient created.
 *      '400':
 *       description: <b>Bad Request</b>, if the client id is not provided.
 *       content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *              message: "Client id is required."
 *      '401':
 *       description: <b>Unauthorized</b>, with an error message.
 *       content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *              message: No authorization token was found.
 *      '404':
 *       description: <b>Not Found</b>, if the client with the given id is not found.
 *       content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *              message: "Client with id '5f9d5b9b9d9d975b9d9d975b' not found."
 *      '500':
 *       description: <b>Internal Server Error</b>, with an error message.
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *              message: "Internal Server Error."
 */

const patientsAddOne = async (req, res) => {
  if (!req.params.clientId) {
    res.status(400).json({
      message: "Client id is required.",
    });
    return;
  }
  const clientId = req.params.clientId;
  try {
    const client = await Client.findById(clientId).exec();
    if (!client) {
      res.status(404).json({
        message: `Client with id '${clientId}' not found`,
      });
      return;
    }

    if (!req.body.name || !req.body.age || !req.body.gender) {
      res.status(400).json({
        message: "Body parameters 'name', 'age' and 'gender' are required.",
      });
      return;
    }

    // Create new patient
    const newPatient = {
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      passportId: req.body.passportId,
      chip: req.body.chip,
      species: req.body.species,
      breed: req.body.breed,
    };

    // checking if this client already has a patient with the same name
    for (var i = 0; i < client.patients.length; i++) {
      if (client.patients[i].name === req.body.name) {
        res.status(400).json({
          message: `Client with id '${clientId}' already has a patient with name '${req.body.name}'`,
        });
        return;
      }
    }

    client.patients.push(newPatient);
    await client.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /patients/{clientId}/{patientId}:
 *  get:
 *   tags: [Patient]
 *   description: Request a patient of a client.
 *   parameters:
 *   - in: path
 *     name: clientId
 *     schema:
 *      type: string
 *     required: true
 *     description: Id of the client.
 *   - in: path
 *     name: patientId
 *     schema:
 *      type: string
 *     required: true
 *     description: Id of the patient.
 *   responses:
 *     '200':
 *      description: <b>OK</b>, a successful response, returns the requested patient.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Patient'
 *     '400':
 *      description: <b>Bad Request</b>, if the client id or patient id is not provided.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *            message: Client id is required.
 *     '404':
 *      description: <b>Not Found</b>, if the client or patient with the given id is not found.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *            message: Client with id '5f9d5b9b9d9d975b9d9d975b' not found.
 *     '500':
 *      description: <b>Internal Server Error</b>, with error message.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *            message: Internal Server Error.
 */

const patientsReadOne = async (req, res) => {
  if (!req.params.clientId) {
    res.status(400).json({
      message: "Client id is required.",
    });
    return;
  }
  if (!req.params.patientId) {
    res.status(400).json({
      message: "Patient id is required.",
    });
    return;
  }
  const clientId = req.params.clientId;
  const patientId = req.params.patientId;
  try {
    const client = await Client.findById(clientId).exec();
    if (!client) {
      res.status(404).json({
        message: `Client with id '${clientId}' not found`,
      });
      return;
    }
    const patient = client.patients.id(patientId);
    if (!patient) {
      res.status(404).json({
        message: `Patient with id '${patientId}' not found`,
      });
      return;
    }
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /patients/{clientId}/{patientId}:
 *  put:
 *   tags: [Patient]
 *   security:
 *    - jwt: []
 *   description: Update a patient of a client.
 *   parameters:
 *   - in: path
 *     name: clientId
 *     schema:
 *      type: string
 *     required: true
 *     description: Id of the client.
 *   - in: path
 *     name: patientId
 *     schema:
 *      type: string
 *     required: true
 *     description: Id of the patient.
 *   requestBody:
 *    description: Patient object that needs to be updated.
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/Patient'
 *   responses:
 *    '200':
 *      description: <b>OK</b>, a successful response, returns the updated patient.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Patient'
 *    '400':
 *      description: <b>Bad Request</b>, if the client id or patient id is not provided.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *              message: Client id is required.
 *    '401':
 *      description: <b>Unauthorized</b>, with an error message.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *              message: No authorization token was found.
 *    '404':
 *      description: <b>Not Found</b>, if the client or patient with the given id is not found.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *              message: Client with id '5f9d5b9b9d9d975b9d9d975b' not found.
 *    '500':
 *      description: <b>Internal Server Error</b>, with error message.
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *            message: Internal Server Error.
 */

const patientsUpdateOne = async (req, res) => {
  if (!req.params.clientId) {
    res.status(400).json({
      message: "Client id is required.",
    });
    return;
  }
  if (!req.params.patientId) {
    res.status(400).json({
      message: "Patient id is required.",
    });
    return;
  }
  const clientId = req.params.clientId;
  const patientId = req.params.patientId;
  try {
    const client = await Client.findById(clientId).exec();
    if (!client) {
      res.status(404).json({
        message: `Client with id '${clientId}' not found`,
      });
      return;
    }
    const patient = client.patients.id(patientId);
    if (!patient) {
      res.status(404).json({
        message: `Patient with id '${patientId}' not found`,
      });
      return;
    }

    if (
      !req.body.name &&
      !req.body.age &&
      !req.body.gender &&
      !req.body.passportId &&
      !req.body.chip &&
      !req.body.species &&
      !req.body.breed &&
      !req.body.clinic
    ) {
      res.status(400).json({
        message:
          "At least one body parameter 'name', 'age', 'gender', 'passportId', 'chip', 'species' or 'breed' is required.",
      });
      return;
    }

    if (req.body.name) patient.name = req.body.name;
    if (req.body.age) patient.age = req.body.age;
    if (req.body.gender) patient.gender = req.body.gender;
    if (req.body.passportId) patient.passportId = req.body.passportId;
    if (req.body.chip) patient.chip = req.body.chip;
    if (req.body.species) patient.species = req.body.species;
    if (req.body.breed) patient.breed = req.body.breed;

    // checking if this client already has a patient with the same name
    for (var i = 0; i < client.patients.length; i++) {
      if (
        client.patients[i].name === req.body.name &&
        client.patients[i]._id != patientId
      ) {
        res.status(400).json({
          message: `Client with id '${clientId}' already has a patient with name '${req.body.name}'`,
        });
        return;
      }
    }

    // if clinic is assigned, we also need to select an employee for this patient
    if (req.body.clinic) {
      // find the clinic by name
      const clinic = await Clinic.findOne({ name: patient.clinic }).exec();

      if (!clinic) {
        res.status(404).json({
          message: `Clinic with name '${patient.clinic}' not found`,
        });
        return;
      }

      patient.clinic = req.body.clinic;

      // choose a random employee from the clinic
      const randomIndex = Math.floor(Math.random() * clinic.employees.length);
      patient.assignedEmployee =
        clinic.employees[randomIndex].name +
        " " +
        clinic.employees[randomIndex].surname;
    }

    await client.save();
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /patients/{clientId}/{patientId}:
 *   delete:
 *     tags: [Patient]
 *     security:
 *      - jwt: []
 *     description: Delete a patient of a client.
 *     parameters:
 *     - in: path
 *       name: clientId
 *       schema:
 *         type: string
 *       required: true
 *       description: Id of the client.
 *     - in: path
 *       name: patientId
 *       schema:
 *         type: string
 *       required: true
 *       description: Id of the patient.
 *     responses:
 *       '204':
 *         description: <b>No Content</b>, a successful response, returns the deleted patient.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       '400':
 *         description: <b>Bad Request</b>, if the client id or patient id is not provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *                 message: Client id is required.
 *       '401':
 *         description: <b>Unauthorized</b>, with an error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *                 message: No authorization token was found.
 *       '404':
 *         description: <b>Not Found</b>, if the client or patient with the given id is not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *                 message: Client with id '5f9d5b9b9d9d975b9d9d975b' not found.
 *       '500':
 *         description: <b>Internal Server Error</b>, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: Internal Server Error.
 */

const patientsDeleteOne = async (req, res) => {
  if (!req.params.clientId) {
    res.status(400).json({
      message: "Client id is required.",
    });
    return;
  }
  if (!req.params.patientId) {
    res.status(400).json({
      message: "Patient id is required.",
    });
    return;
  }

  const clientId = req.params.clientId;
  const patientId = req.params.patientId;
  try {
    const client = await Client.findById(clientId).exec();
    if (!client) {
      res.status(404).json({
        message: `Client with id '${clientId}' not found`,
      });
      return;
    }
    const patient = client.patients.id(patientId);
    if (!patient) {
      res.status(404).json({
        message: `Patient with id '${patientId}' not found`,
      });
      return;
    }
    patient.deleteOne();
    await client.save();
    res.status(204).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  patientsReadAll,
  patientsAddOne,
  patientsReadOne,
  patientsUpdateOne,
  patientsDeleteOne,
};
