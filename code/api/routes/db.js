const express  = require('express');
const router = express.Router();

const fs = require("fs").promises;

const mongoose = require("mongoose");
const Appointment = mongoose.model("Appointment");
const Client = mongoose.model("Client");
const Clinic = mongoose.model("Clinic");

/**
 * @openapi
 * /db:
 *  delete:
 *    summary: Delete all data from the database.
 *    description: Delete all data from the database.
 *    tags: [Database]
 *    responses:
 *      '204':
 *        description: <b>No Content</b>, with message.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Message describing the deletion.
 *            example: All data deleted.
 *      '500':
 *         description: <b>Internal Server Error</b>, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *             example: "Error message."
 */
router.delete("/", async (req, res) => {
  try {
    await Appointment.deleteMany({});
    await Client.deleteMany({});
    await Clinic.deleteMany({});
    res.status(204).json({ message: "All data deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @openapi
 * /db:
 *  post:
 *    summary: Post data to the database.
 *    description: Post data to the database.
 *    tags: [Database]
 *    responses:
 *      '201':
 *        description: <b>Created</b>, with message.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Message describing the import.
 *            example: All data imported.
 *      '500':
 *         description: <b>Internal Server Error</b>, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *             example: "Error message."
 */
router.post("/", async (req, res) => {
  try {
    // Read data from JSON files
    const jsonDataClients = await fs.readFile("data/clients.json", "utf8");
    const clientsParsed = JSON.parse(jsonDataClients);
    await Client.insertMany(clientsParsed);

    const jsonDataClinics = await fs.readFile("data/clinics.json", "utf8");
    const clinicsParsed = JSON.parse(jsonDataClinics);
    await Clinic.insertMany(clinicsParsed);

    const jsonDataAppointments = await fs.readFile(
      "data/appointments.json",
      "utf8",
    );
    const appointmentsParsed = JSON.parse(jsonDataAppointments);
    await Appointment.insertMany(appointmentsParsed);

    res.status(201).json({ message: "All data imported." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;