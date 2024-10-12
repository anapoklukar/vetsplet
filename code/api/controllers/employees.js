const mongoose = require("mongoose");
const Clinic = mongoose.model("Clinic");
const Client = mongoose.model("Client");
const bcrypt = require("bcrypt");

/**
 * @openapi
 *  /employees/{clinicId}:
 *    get:
 *      summary: Read all employees of a clinic.
 *      description: Read all employees of a clinic.
 *      tags: [Employee]
 *      parameters:
 *        - in: path
 *          name: clinicId
 *          schema:
 *            type: string
 *          required: true
 *          description: Clinic id
 *          example: '5f9d88b9c4b9e3b3d8c9d1b0'
 *      responses:
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Clinic id is required."
 *        '404':
 *          description: <b>Not Found</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "No employees found for clinic with id '5f9d88b9c4b9e3b3d8c9d1b0'."
 *        '200':
 *          description: <b>OK</b>, a successful response.cli
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Employee'  # Assuming you have an 'Employee' schema
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Internal Server Error."
 */

// Read all employees of a clinic
const employeesReadAll = async (req, res) => {
  if (!req.params.clinicId) {
    res.status(400).json({
      message: "Clinic id is required.",
    });
    return;
  }
  const clinicId = req.params.clinicId;
  try {
    // Retrieve only confirmed employees
    const clinic = await Clinic.findById(clinicId)
      .populate({
        path: "employees",
      })
      .exec();

    if (!clinic) {
      res.status(404).json({
        message: `Clinic with id '${clinicId}' not found`,
      });
      return;
    }

    // if clinic has no employees
    if (clinic.employees.length === 0) {
      res.status(404).json({ message: "Clinic has no employees." });
      return;
    }

    res.status(200).json(clinic.employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 *  /employees/:
 *    post:
 *      summary: Create a new employee.
 *      description: Create a new employee.
 *      tags: [Employee]
 *      requestBody:
 *        description: Employee details.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Employee'
 *            example:
 *              profession: Veterinarian
 *              name: John
 *              surname: Doe
 *              telNumber: 123-456-789
 *              email: john.doe@example.com
 *              username: johndoe
 *              password: secret
 *              clinic: 'Domaci Vet'
 *      responses:
 *        '201':
 *          description: <b>Created</b>, a successful response with JWT token, id and clinicId.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    description: JWT token
 *              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              examples:
 *                value:
 *                  message: "Clinic name is required."
 *        '404':
 *          description: <b>Not Found</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Clinic with name '5f9d88b9c4b9e3b3d8c9d1b2' not found."
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Internal Server Error.
 */

// Add an employee to a clinic
const employeesAddOne = async (req, res) => {
  if (!req.body.clinic) {
    res.status(400).json({
      message: "Clinic name is required.",
    });
    return;
  }

  const clinicName = req.body.clinic;

  try {
    // Get clinic by name
    const clinic = await Clinic.findOne({ name: clinicName }).exec();

    if (!clinic) {
      res.status(404).json({
        message: `Clinic with name '${clinicName}' not found`,
      });
      return;
    }

    if (
      !req.body.profession ||
      !req.body.name ||
      !req.body.surname ||
      !req.body.telNumber ||
      !req.body.email ||
      !req.body.username ||
      !req.body.password ||
      !req.body.clinic
    ) {
      res.status(400).json({
        message:
          "Body parameters 'profession', 'name', 'surname', 'telNumber', 'email', 'username', 'password' and 'clinic' are required.",
      });
      return;
    }


    const salt = 10;
    const hashed = await bcrypt.hash(req.body.password, salt);


    // Create new employee
    const newEmployee = {
      profession: req.body.profession,
      name: req.body.name,
      surname: req.body.surname,
      telNumber: req.body.telNumber,
      email: req.body.email,
      username: req.body.username,
      password: hashed,
      clinic: req.body.clinic,
      status: "pending",
      isOwner: false,
    };

    // check if employee with the same email or username already exists
    let isUnique = await checkIfEmployeeUnique(
      newEmployee.email,
      newEmployee.username,
    );

    if (!isUnique) {
      res.status(400).json({
        message:
          "Employee or client with the same email or username already exists!",
      });
      return;
    }

    // if this is the first employee of the clinic, make them the owner and they are confirmed
    if (clinic.employees.length === 0) {
      newEmployee.isOwner = true;
      newEmployee.status = "confirmed";
    }

    clinic.employees.push(newEmployee); // Add the new employee to the clinic
    await clinic.save(); // Save the updated clinic

    res.status(201).json({ token: newEmployee.generateJwt(), id: newEmployee._id, clinicId: clinic._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 *  /employees/confirm/{clinicId}/{employeeId}:
 *     put:
 *      summary: Confirm an employee of a clinic.
 *      tags: [Employee]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - name: clinicId
 *          in: path
 *          schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *          description: Id of the clinic to confirm.
 *          required: true
 *          example: '5f9d88b9c4b9e3b3d8c9d1b2'
 *        - name: employeeId
 *          in: path
 *          schema:
 *            type: string
 *            pattern: '^[0-9a-fA-F]{24}$'
 *          description: Id of the employee to confirm.
 *          required: true
 *          example: '5f9d88b9c4b9e3b3d8d5t2d6'
 *     responses:
 *       '200':
 *         description: <b>OK</b>, with employee details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       '400':
 *         description: <b>Bad Request</b>, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: "Clinic id is required."
 *       '401':
 *         description: <b>Unauthorized</b>, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: No authorization token was found.
 *       '404':
 *         description: <b>Not Found</b>, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: "Clinic with id '5f9d88b9c4b9e3b3d8c9d1b2' not found."
 *       '409':
 *         description: <b>Conflict</b>, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: "Employee is already confirmed."
 *       '500':
 *         description: <b>Internal Server Error</b>, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: "Internal server error."
 */

// Confirm an employee of a clinic
const employeesConfirmOne = async (req, res) => {
  if (!req.params.clinicId) {
    res.status(400).json({
      message: "Clinic id is required.",
    });
    return;
  }
  if (!req.params.employeeId) {
    res.status(400).json({
      message: "Employee id is required.",
    });
    return;
  }

  const clinicId = req.params.clinicId;
  const employeeId = req.params.employeeId;

  try {
    const clinic = await Clinic.findById(clinicId).exec();
    if (!clinic) {
      res.status(404).json({
        message: `Clinic with id '${clinicId}' not found`,
      });
      return;
    }

    const employee = clinic.employees.id(employeeId);
    if (!employee) {
      res.status(404).json({
        message: `Employee with id '${employeeId}' not found in clinic '${clinicId}'`,
      });
      return;
    }

    if (employee.status === "confirmed") {
      res.status(409).json({
        message: "Employee is already confirmed.",
      });
      return;
    }

    employee.status = "confirmed"; // Confirm the employee
    await clinic.save(); // Save the updated clinic

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 *  /employees/{clinicId}/{employeeId}:
 *    get:
 *     summary: Read one employee of a clinic.
 *     description: Read one employee of a clinic.
 *     tags: [Employee]
 *     parameters:
 *      - name: clinicId
 *        in: path
 *        schema:
 *         type: string
 *        pattern: '^[0-9a-fA-F]{24}$'
 *        description: Id of the clinic to read.
 *        required: true
 *        example: '5f9d88b9c4b9e3b3d8c9d1b1'
 *      - name: employeeId
 *        in: path
 *        schema:
 *          type: string
 *          pattern: '^[0-9a-fA-F]{24}$'
 *        description: Id of the employee to read.
 *        required: true
 *        example: '5f9d88b9c4b9e3b3d8d5t2d5'
 *     responses:
 *      '400':
 *       description: <b>Bad Request</b>, with error message.
 *       content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *              message: "Clinic id is required."
 *      '404':
 *       description: <b>Not Found</b>, with error message.
 *       content:
 *        application/json:
 *         schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *         example:
 *             message: "Clinic with id '5f9d88b9c4b9e3b3d8c9d1b1' not found"
 *      '200':
 *       description: <b>OK</b>, with employee details.
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Employee'
 *      '500':
 *       description: <b>Internal Server Error</b>, with error message.
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#/components/schemas/ErrorMessage'
 *         example:
 *             message: "Internal Server Error."
 */

// Read one employee of a clinic
const employeesReadOne = async (req, res) => {
  if (!req.params.clinicId) {
    res.status(400).json({
      message: "Clinic id is required.",
    });
    return;
  }
  if (!req.params.employeeId) {
    res.status(400).json({
      message: "Employee id is required.",
    });
    return;
  }

  const clinicId = req.params.clinicId;
  const employeeId = req.params.employeeId;

  try {
    const clinic = await Clinic.findById(clinicId).exec();
    if (!clinic) {
      res.status(404).json({
        message: `Clinic with id '${clinicId}' not found`,
      });
      return;
    }

    const employee = clinic.employees.id(employeeId);
    if (!employee) {
      res.status(404).json({
        message: `Employee with id '${employeeId}' not found in clinic '${clinicId}'`,
      });
      return;
    }

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 *  /employees/{clinicId}/{employeeId}:
 *    put:
 *      summary: Update an employee.
 *      description: Update an employee.
 *      tags: [Employee]
 *      security:
 *       - jwt: []
 *      parameters:
 *      - name: clinicId
 *        in: path
 *        schema:
 *          type: string
 *          pattern: '^[0-9a-fA-F]{24}$'
 *        description: Id of the clinic to update.
 *        required: true
 *        example: '5f9d88b9c4b9e3b3d8c9d1b2'
 *      - name: employeeId
 *        in: path
 *        schema:
 *          type: string
 *          pattern: '^[0-9a-fA-F]{24}$'
 *        description: Id of the employee to update.
 *        required: true
 *        example: '5f9d88b9c4b9e3b3d8d5t2d6'
 *      requestBody:
 *        description: Employee details.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Employee'
 *            example:
 *              telNumber: 123-456-789
 *              email: john.doe@example.com
 *      responses:
 *        '200':
 *          description: <b>OK</b>, with employee details.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Employee'
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Clinic name is required."
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
 *                message: "Clinic with name '5f9d88b9c4b9e3b3d8c9d1b2' not found."
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Internal Server Error.
 */

// Update one employee of a clinic
const employeesUpdateOne = async (req, res) => {
  if (!req.params.clinicId) {
    res.status(400).json({
      message: "Clinic id is required.",
    });
    return;
  }

  if (!req.params.employeeId) {
    res.status(400).json({
      message: "Employee id is required.",
    });
    return;
  }

  const clinicId = req.params.clinicId;
  const employeeId = req.params.employeeId;

  try {
    const clinic = await Clinic.findById(clinicId).exec();
    if (!clinic) {
      res.status(404).json({
        message: `Clinic with id '${clinicId}' not found`,
      });
      return;
    }

    const employee = clinic.employees.id(employeeId);
    if (!employee) {
      res.status(404).json({
        message: `Employee with id '${employeeId}' not found in clinic '${clinicId}'`,
      });
      return;
    }

    // status and isOwner cannot be updated
    if (req.body.status) {
      res.status(400).json({
        message: "Body parameter 'status' cannot be updated.",
      });
      return;
    }
    if (req.body.isOwner) {
      res.status(400).json({
        message: "Body parameter 'isOwner' cannot be updated.",
      });
      return;
    }

    if (
      !req.body.profession &&
      !req.body.name &&
      !req.body.surname &&
      !req.body.telNumber &&
      !req.body.email &&
      !req.body.username &&
      !req.body.password
    ) {
      res.status(400).json({
        message:
          "At least one body parameter 'profession', 'name', 'surname', 'telNumber', 'email', 'username' or 'password' is required.",
      });
      return;
    }

    // Update employee properties
    if (req.body.profession) employee.profession = req.body.profession;
    if (req.body.name) employee.name = req.body.name;
    if (req.body.surname) employee.surname = req.body.surname;
    if (req.body.telNumber) employee.telNumber = req.body.telNumber;
    if (req.body.email) employee.email = req.body.email;
    if (req.body.username) employee.username = req.body.username;
    if (req.body.password) employee.password = req.body.password;

    if (req.body.email || req.body.username) {
      // check if employee with the same email or username already exists
      let isUnique = await checkIfEmployeeUnique(
        employee.email,
        employee.username,
      );

      if (!isUnique) {
        res.status(400).json({
          message:
            "Employee or client with the same email or username already exists!",
        });
        return;
      }
    }

    await clinic.save(); // Save the updated clinic

    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/***
 * @openapi
 * /employees/{clinicId}/{employeeId}:
 *   delete:
 *    summary: Delete one employee of a clinic.
 *    description: Delete one employee of a clinic.
 *    tags: [Employee]
 *    parameters:
 *     - name: clinicId
 *       in: path
 *       schema:
 *        type: string
 *        pattern: '^[0-9a-fA-F]{24}$'
 *       description: Id of the clinic to delete.
 *       required: true
 *       example: '5f9d88b9c4b9e3b3d8c9d1b2'
 *     - name: employeeId
 *       in: path
 *       schema:
 *        type: string
 *        pattern: '^[0-9a-fA-F]{24}$'
 *       description: Id of the employee to delete.
 *       required: true
 *       example: '5f9d88b9c4b9e3b3d8d5t2d6'
 *    responses:
 *      '204':
 *       description: <b>No Content</b>, with employee details.
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Employee'
 *      '400':
 *       description: <b>Bad Request</b>, with error message.
 *       content:
 *        application/json:
 *         schema:
 *          $ref: '#/components/schemas/ErrorMessage'
 *         example:
 *             message: "Clinic id is required."
 *      '404':
 *       description: <b>Not Found</b>, with error message.
 *       content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *            message: "Clinic with id '5f9d88b9c4b9e3b3d8c9d1b2' not found"
 *      '500':
 *       description: <b>Internal Server Error</b>, with error message.
 *       content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *           message: Internal Server Error.
 */

// Delete one employee of a clinic
const employeesDeleteOne = async (req, res) => {
  if (!req.params.clinicId) {
    res.status(400).json({
      message: "Clinic id is required.",
    });
    return;
  }
  if (!req.params.employeeId) {
    res.status(400).json({
      message: "Employee id is required.",
    });
    return;
  }

  const clinicId = req.params.clinicId;
  const employeeId = req.params.employeeId;

  try {
    const clinic = await Clinic.findById(clinicId).exec();
    if (!clinic) {
      res.status(404).json({
        message: `Clinic with id '${clinicId}' not found`,
      });
      return;
    }

    const employee = clinic.employees.id(employeeId);
    if (!employee) {
      res.status(404).json({
        message: `Employee with id '${employeeId}' not found in clinic '${clinicId}'`,
      });
      return;
    }

    // if the employee is the owner, they cannot be deleted
    if (employee.isOwner) {
      res.status(400).json({
        message: "Employee is the owner and cannot be deleted.",
      });
      return;
    }

    employee.deleteOne(); // Remove the employee from the clinic
    await clinic.save(); // Save the updated clinic

    res.status(204).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkIfEmployeeUnique = async (email, username) => {
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

  // looking through all clients
  let clients = await Client.find().exec();
  for (let i = 0; i < clients.length; i++) {
    // if username or email already exists
    if (clients[i].username === username || clients[i].email === email) {
      return false;
    }
  }

  return true;
};

module.exports = {
  employeesReadAll,
  employeesAddOne,
  employeesReadOne,
  employeesUpdateOne,
  employeesDeleteOne,
  employeesConfirmOne,
};
