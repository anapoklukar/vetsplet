const mongoose = require("mongoose");
const Client = mongoose.model("Client");
const Clinic = mongoose.model("Clinic");
const bcrypt = require("bcrypt");

/**
 * @openapi
 *  /clients:
 *   get:
 *    summary: Reads all clients.
 *    description: Reads all clients.
 *    tags: [Client]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, a successful response.
 *     '404':
 *      description: <b>Not Found</b>, clients not found.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: Clients not found
 *     '500':
 *      description: <b>Internal Server Error</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: Internal Server Error.
 */

const clientsReadAll = async (req, res) => {
  try {
    let clients = await Client.find().exec();
    if (!clients || clients.length === 0) {
      res.status(404).json({
        message: "Clients not found",
      });
    } else {
      res.status(200).json(clients);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /clients:
 *  post:
 *   summary: Creates new client.
 *   description: Creates new client.
 *   tags: [Client]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *         name:
 *          type: string
 *          description: Name of the client.
 *          example: Janez
 *         surname:
 *          type: string
 *          description: Surname of the client.
 *          example: Novak
 *         telNumber:
 *          type: string
 *          description: Telephone number of the client.
 *          example: 031-123-456
 *         email:
 *          type: string
 *          description: Email of the client.
 *          example: novakjanez89@yahoo.com
 *         username:
 *          type: string
 *          description: Username of the client.
 *          example: novakjanez89
 *         password:
 *          type: string
 *          description: Password of the client.
 *          example: janez123
 *       required:
 *         - name
 *         - surname
 *         - telNumber
 *         - email
 *         - username
 *         - password
 *   responses:
 *    '201':
 *     description: <b>Created</b>, a successful response with JWT token and id.
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *            token:
 *              type: string
 *              description: JWT token.
 *         example:
 *           token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *    '400':
 *     description: <b>Bad Request</b>, with error message.
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *         example:
 *           message: Body parameters 'name', 'surname', 'telNumber', 'email', 'username', and 'password' are required!
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *          message: Internal Server Error.
 */

const clientsAddOne = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.surname ||
    !req.body.telNumber ||
    !req.body.email ||
    !req.body.username ||
    !req.body.password
  ) {
    res.status(400).json({
      message:
        "Body parameters 'name', 'surname', 'telNumber', 'email', 'username', and 'password' are required!",
    });
    return;
  }

  // check that username and email are unique
  let isUnique = await checkIfClientUnique(req.body.username, req.body.email);

  if (!isUnique) {
    res.status(400).json({
      message: "Username or email already exists!",
    });
    return;
  }

    const salt = 10;
    const hashed = await bcrypt.hash(req.body.password, salt);  
  // create new client
  let newClient = new Client({
    name: req.body.name,
    surname: req.body.surname,
    telNumber: req.body.telNumber,
    email: req.body.email,
    username: req.body.username,
      password: hashed,
    salt: salt,
    patients: [],
    ethAddress: req.body.ethAddress,
    ethRole: req.body.ethRole,
  });

  try {
    // save new client
    const savedClient = await newClient.save();
    res.status(201).json({ token: savedClient.generateJwt(), id: savedClient._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /clients/{clientId}:
 *  get:
 *   summary: Reads client.
 *   description: Reads client.
 *   tags: [Client]
 *   responses:
 *    '200':
 *     description: <b>OK</b>, a successful response.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Client'
 *       example:
 *         name: Janez
 *         surname: Novak
 *         telNumber: 031-123-456
 *         email: novakjanez89@yahoo.com
 *         username: novakjanez89
 *         password: janez123
 *    '400':
 *     description: <b>Bad Request</b>, with error message.
 *     content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *          message: Client id is required.
 *    '404':
 *     description: <b>Not Found</b>, client not found.
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *         example:
 *           message: Client with id '5f8b4b5a8e3b9c2b1c4a9c16' not found.
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *         example:
 *           message: Internal Server Error.
 */

const clientsReadOne = async (req, res) => {
  if (!req.params.clientId) {
    res.status(400).json({
      message: "Client id is required.",
    });
    return;
  }
  try {
    let client = await Client.findOne({ _id: req.params.clientId }).exec();

    if (!client) {
      res.status(404).json({
        message: `Client with id '${req.params.clientId}' not found.`,
      });
    } else {
      res.status(200).json(client);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 * /clients/{clientId}:
 *  put:
 *    summary: Updates client.
 *    description: Updates client.
 *    tags: [Client]
 *    security:
 *      - jwt: []
 *    requestBody:
 *      description: Client object that needs to be updated.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Client'
 *          example:
 *            name: Janez
 *            surname: Novak
 *            telNumber: 031-741-789
 *            email: novakjanez89@yahoo.com
 *            username: novakjanez89
 *            password: 02ydeu
 *    responses:
 *      '200':
 *        description: <b>OK</b>, a successful response.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Client'
 *            example:
 *              name: Janez
 *              surname: Novak
 *              telNumber: 031-741-789
 *              email: novakjanez89@yahoo.com
 *              username: novakjanez89
 *              password: 02ydeu
 *      '400':
 *        description: <b>Bad Request</b>, with error message.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *              message: Client id is required. Username or email already exists!
 *      '401':
 *        description: <b>Unauthorized</b>, with error message.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *              message: No authorization token was found.
 *      '404':
 *        description: <b>Not Found</b>, client not found.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *              message: Client with id '5f8b4b5a8e3b9c2b1c4a9c16' not found.
 *      '500':
 *        description: <b>Internal Server Error</b>, with error message.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *              message: Internal Server Error.
 */

const clientsUpdateOne = async (req, res) => {
  if (!req.params.clientId) {
    res.status(400).json({
      message: "Client id is required.",
    });
    return;
  }
  try {
    let client = await Client.findOne({ _id: req.params.clientId }).exec();

    if (!client) {
      res.status(404).json({
        message: `Client with id '${req.params.clientId}' not found`,
      });
    } else {
      // Update client properties
      if (req.body.name) client.name = req.body.name;
      if (req.body.surname) client.surname = req.body.surname;
      if (req.body.telNumber) client.telNumber = req.body.telNumber;
      if (req.body.email) client.email = req.body.email;
      if (req.body.username) client.username = req.body.username;
      if (req.body.password) client.password = req.body.password;
      if (req.body.ethAddress) client.ethAddress = req.body.ethAddress;
      if (req.body.ethRole) client.ethRole = req.body.ethRole;

      // scheck if username and email are unique
      if (req.body.username || req.body.email) {
        let isUnique = await checkIfClientUnique(client.username, client.email);

        if (!isUnique) {
          res.status(400).json({
            message: "Username or email already exists!",
          });
          return;
        }
      }

      await client.save();
      res.status(200).json(client);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 *  /clients/{clientId}:
 *  delete:
 *    summary: Deletes client.
 *    description: Deletes client.
 *    tags: [Client]
 *    security:
 *      - jwt: []
 *    responses:
 *      '204':
 *        description: <b>No Content</b>, a successful response.
 *      '400':
 *        description: <b>Bad Request</b>, with error message.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *              message: Client id is required.
 *      '401':
 *        description: <b>Unauthorized</b>, with error message.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *              message: No authorization token was found.
 *      '404':
 *        description: <b>Not Found</b>, client not found.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *              message: Client with id '5f8b4b5a8e3b9c2b1c4a9c16' not found.
 *      '500':
 *        description: <b>Internal Server Error</b>, with error message.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *              message: Internal Server Error.
 */

const clientsDeleteOne = async (req, res) => {
  if (!req.params.clientId) {
    res.status(400).json({
      message: "Client id is required.",
    });
    return;
  }
  try {
    let client = await Client.findOne({ _id: req.params.clientId }).exec();

    if (!client) {
      res.status(404).json({
        message: `Client with id '${req.params.clientId}' not found`,
      });
    } else {
      await client.deleteOne();
      res.status(204).json(client);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkIfClientUnique = async (username, email) => {
  // looking through all clients
  let clients = await Client.find().exec();
  for (let i = 0; i < clients.length; i++) {
    // if username or email already exists
    if (clients[i].username === username || clients[i].email === email) {
      return false;
    }
  }

  // looking through all employees of all clinics
  let clinics = await Clinic.find().exec();
  for (let i = 0; i < clinics.length; i++) {
    for (let j = 0; j < clinics[i].employees.length; j++) {
      // if username or email already exists
      if (
        clinics[i].employees[j].username === username ||
        clinics[i].employees[j].email === email
      ) {
        return false;
      }
    }
  }

  return true;
};

module.exports = {
  clientsReadAll,
  clientsAddOne,
  clientsReadOne,
  clientsUpdateOne,
  clientsDeleteOne,
};
