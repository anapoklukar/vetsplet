const mongoose = require("mongoose");
const Client = mongoose.model("Client");
const Clinic = mongoose.model("Clinic");
const bcrypt = require("bcrypt");

/**
 * @openapi
 * /login:
 *   post:
 *    summary: Login
 *    description: Login for clients and employees.
 *    tags: [Client, Employee]
 *    requestBody:
 *      description: Client or employee username and password.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                description: Username of the client or employee.
 *                example: "novakjanez89"
 *              password:
 *                type: string
 *                description: Password of the client or employee.
 *                example: "02ydeu"
 *            required:
 *              - username
 *              - password
 *    responses:
 *      '200':
 *        description: <b>Successful login</b> response with JWT token and necessary ids.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: JWT token.
 *            example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *      '400':
 *        description: <b>Bad Request</b>, with error message.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *                message: "Body parameters 'username' and 'password' are required."
 *      '404':
 *        description: <b>Not Found</b>, with error message.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *                message: "User with username 'novakjanez89' not found."
 *      '500':
 *        description: <b>Internal Server Error</b>, with error message.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 *            example:
 *              message: Internal Server Error.
 */

const login = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      message: "Body parameters 'username' and 'password' are required.",
    });
    return;
  }
  try {
    // find the client or the employee with the given username

    // find the client
      const client = await Client.findOne({ username: req.body.username }).exec();

    if (client) {
      // check if the password is correct
        const validPass = await bcrypt.compare(req.body.password, client.password);
      if (validPass) {
        res.status(200).json({ token: client.generateJwt(), id: client._id });
      } else {
        res.status(400).json({
          message: "Wrong password.",
        });
      }
    } else {
      // find the employee
      const clinic = await Clinic.findOne({
        employees: { $elemMatch: { username: req.body.username } },
      }).exec();
        if (clinic) {

        const employee = clinic.employees.find(
          (employee) => employee.username === req.body.username,
            );
        const validPass = await bcrypt.compare(req.body.password, employee.password);
        // check if the password is correct
        if (validPass) {
          res.status(200).json({ token: employee.generateJwt(), id: employee._id, clinicId: clinic._id });
        } else {
          res.status(400).json({
            message: "Wrong password.",
          });
        }
      } else {
        res.status(404).json({
          message: `User with username '${req.body.username}' not found.`,
        });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { login };