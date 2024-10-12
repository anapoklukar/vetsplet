const mongoose = require("mongoose");
const Clinic = mongoose.model("Clinic");

/**
 * @openapi
 *  /clinics:
 *    get:
 *     summary: Get all clinics
 *     description: Get all clinics.
 *     tags: [Clinic]
 *     responses:
 *       '200':
 *         description: <b>OK</b>, successful response, clinics found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       '404':
 *         description: <b>Not Found</b>, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: "Clinics not found."
 *       '500':
 *         description: <b>Internal Server Error</b>, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *             example:
 *               message: "Internal Server Error."
 */

const clinicsReadAll = async (req, res) => {
  try {
    let clinics = await Clinic.find().exec();
    if (!clinics || clinics.length == 0) {
      res.status(404).json({
        message: "Clinics not found.",
      });
    } else {
      res.status(200).json(clinics);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 *   /clinics:
 *    post:
 *     summary: Create new clinic
 *     description: Create new clinic.
 *     tags: [Clinic]
 *     requestBody:
 *       description: Clinic object that needs to be added to the database.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Clinic'
 *           example:
 *             owner: Dr. Angela Stopar
 *             name: Domači Vet
 *             address: Slovenska cesta 18, 1000 Ljubljana
 *             telNumber: 031-951-357
 *             email: domaci.vet@gmail.com
 *             description: Veterinarska ambulanta Domači Vet je odprta od ponedeljka do petka od 8.00 do 19.00 ure, v soboto od 8.00 do 12.00 ure. V primeru nujnih primerov smo dosegljivi 24 ur na dan, vse dni v letu.
 *             employees: Dr. Angela Stopar, Dr. Peter Novak
 *           required:
 *             - owner
 *             - name
 *             - address
 *             - telNumber
 *             - email
 *             - description
 *             - employees
 *     responses:
 *      '201':
 *       description: <b>Created</b>, new clinic created.
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Clinic'
 *      '400':
 *       description: <b>Bad Request</b>, with error message.
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *              message: "Body parameters 'owner', 'name', 'address', 'telNumber', 'email' and 'description' are required."
 *      '500':
 *       description: <b>Internal Server Error</b>, with error message.
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ErrorMessage'
 *          example:
 *            message: "Internal Server Error."
 */

const clinicsAddOne = async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "Body required.",
    });
    return;
  }
  if (
    !req.body.owner ||
    !req.body.name ||
    !req.body.address ||
    !req.body.telNumber ||
    !req.body.email ||
    !req.body.description
  ) {
    res.status(400).json({
      message:
        "Body parameters 'owner', 'name', 'address', 'telNumber', 'email' and 'description' are required.",
    });
  } else {
    // create new clinic
    let newClinic = new Clinic({
      owner: req.body.owner,
      name: req.body.name,
      address: req.body.address,
      telNumber: req.body.telNumber,
      email: req.body.email,
      description: req.body.description,
      employees: [],
    });

    // check if clinic with the same name or email already exists
    let isUnique = await checkIfClinicUnique(req.body.name, req.body.email);

    if (!isUnique) {
      res.status(400).json({
        message: "Clinic with the same name or email already exists!",
      });
      return;
    }

    try {
      // save new clinic
      const savedClinic = await newClinic.save();
      // adding 5 second delay to simulate slow network
      setTimeout(() => {
        res.status(201).json(savedClinic);
      }, 5000);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

/**
 * @openapi
 *  /clinics/{clinicId}:
 *    get:
 *      summary: Get clinic by id
 *      description: Get clinic by id.
 *      tags: [Clinic]
 *      parameters:
 *        - in: path
 *          name: clinicId
 *          schema:
 *            type: string
 *          required: true
 *          description: Clinic id
 *          example: "5f9b2b3b9c4b0e2a3c8b4567"
 *      responses:
 *        '200':
 *          description: <b>OK</b>, successful response, clinic found.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Clinic'
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
 *                message: "Clinic with id '5f9b2b3b9c4b0e2a3c8b4567' not found."
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Internal Server Error."
 */

const clinicsReadOne = async (req, res) => {
  if (!req.params.clinicId) {
    res.status(400).json({
      message: "Clinic id is required.",
    });
    return;
  }
  try {
    let clinic = await Clinic.findOne({ _id: req.params.clinicId }).exec();

    if (!clinic) {
      res.status(404).json({
        message: `Clinic with id '${req.params.clinicId}' not found.`,
      });
    } else {
      res.status(200).json(clinic);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @openapi
 *  /clinics/{clinicId}:
 *    put:
 *      summary: Update clinic by id
 *      description: Update clinic by id.
 *      tags: [Clinic]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: clinicId
 *          schema:
 *            type: string
 *          required: true
 *          description: Clinic id
 *          example: "5f9b2b3b9c4b0e2a3c8b4567"
 *      requestBody:
 *        description: Clinic object that needs to be updated in the database.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Clinic'
 *            example:
 *              owner: Dr. Angela Stopar
 *              name: Domači Vet
 *              address: Slovenska cesta 18, 1000 Ljubljana
 *              telNumber: 031-951-357
 *              email: domaci.vet@gmail.com
 *              description: Veterinarska ambulanta Domači Vet je odprta od ponedeljka do petka od 8.00 do 19.00 ure, v soboto od 8.00 do 12.00 ure. V primeru nujnih primerov smo dosegljivi 24 ur na dan, vse dni v letu.
 *      responses:
 *        '200':
 *          description: <b>OK</b>, successful response, clinic updated.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Clinic'
 *              example:
 *                owner: Dr. Angela Stopar
 *                name: Domači Vet
 *                address: Slovenska cesta 18, 1000 Ljubljana
 *                telNumber: 031-060-262 // updated telNumber
 *                email: domaci.vet@gmail.com
 *                description: Veterinarska ambulanta Domači Vet je odprta od ponedeljka do petka od 8.00 do 19.00 ure, v soboto od 8.00 do 12.00 ure. V primeru nujnih primerov smo dosegljivi 24 ur na dan, vse dni v letu.
 *                employees: Dr. Angela Stopar, Dr. Peter Novak, Dr. Maja Kovač, Dr. Andrej Kovačič // updated employees
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                  message: "Clinic id is required."
 *        '401':
 *          description: <b>Unauthorized</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                  message: No authorization token was found.
 *        '404':
 *          description: <b>Not Found</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Clinic with id '5f9b2b3b9c4b0e2a3c8b4567' not found."
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Internal Server Error."
 */

const clinicsUpdateOne = async (req, res) => {
  if (!req.params.clinicId) {
    res.status(400).json({
      message: "Clinic id is required.",
    });
  } else {
    try {
      let clinic = await Clinic.findOne({ _id: req.params.clinicId }).exec();
      if (!clinic) {
        res.status(404).json({
          message: `Clinic with id '${req.params.clinicId}' not found`,
        });
      } else {
        if (
          !req.body.owner &&
          !req.body.name &&
          !req.body.address &&
          !req.body.telNumber &&
          !req.body.email
        ) {
          res.status(400).json({
            message:
              "At least one body parameter 'owner', 'name', 'address', 'telNumber' or 'email' is required.",
          });
        } else {
          if (req.body.owner) clinic.owner = req.body.owner;
          if (req.body.name) clinic.name = req.body.name;
          if (req.body.address) clinic.address = req.body.address;
          if (req.body.telNumber) clinic.telNumber = req.body.telNumber;
          if (req.body.email) clinic.email = req.body.email;
          if (req.body.description) clinic.description = req.body.description;

          if (req.body.email || req.body.name) {
            // check if clinic with the same name or email already exists
            let isUnique = await checkIfClinicUnique(clinic.name, clinic.email);

            if (!isUnique) {
              res.status(400).json({
                message: "Clinic with the same name or email already exists!",
              });
              return;
            }
          }

          await clinic.save();
          res.status(200).json(clinic);
        }
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

/**
 * @openapi
 *   /clinics/{clinicId}:
 *    delete:
 *      summary: Delete clinic by id
 *      description: Delete clinic by id.
 *      tags: [Clinic]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: clinicId
 *          schema:
 *            type: string
 *          required: true
 *          description: Clinic id
 *          example: 5f9b2b3b9c4b0e2a3c8b4567
 *      responses:
 *        '204':
 *          description: <b>No Content</b>, successful response, clinic deleted.
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Clinic id is required."
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
 *                message: "Clinic with id '5f9b2b3b9c4b0e2a3c8b4567' not found."
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Internal Server Error."
 */

const clinicsDeleteOne = async (req, res) => {
  if (!req.params.clinicId) {
    res.status(400).json({
      message: "Clinic id is required.",
    });
  } else {
    try {
      let clinic = await Clinic.findOne({ _id: req.params.clinicId }).exec();
      if (!clinic) {
        res.status(404).json({
          message: `Clinic with id '${req.params.clinicId}' not found`,
        });
      } else {
        await clinic.deleteOne();
        res.status(204).json(clinic);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

const checkIfClinicUnique = async (name, email) => {
  let clinic = await Clinic.findOne({ name: name, email: email }).exec();
  if (!clinic) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  clinicsReadAll,
  clinicsAddOne,
  clinicsReadOne,
  clinicsUpdateOne,
  clinicsDeleteOne,
};
