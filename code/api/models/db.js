const mongoose = require("mongoose");
const fs = require("fs").promises;

let dbURI = "mongodb://127.0.0.1/VetClinicDB";
if (process.env.NODE_ENV === "production")
  dbURI = process.env.MONGODB_ATLAS_URI;
else if (process.env.NODE_ENV === "test")
  dbURI = "mongodb://vetsplet-mongo-db/VetClinicDB";
mongoose.connect(dbURI);

mongoose.connection.on("connected", () =>
  console.log(`Mongoose connected to ${dbURI.replace(/:.+?@/, ":*****@")}.`),
  // populateDB(),
  //debugDB(),
);
mongoose.connection.on("error", (err) =>
  console.log(`Mongoose connection error: ${err}.`),
);
mongoose.connection.on("disconnected", () =>
  console.log("Mongoose disconnected"),
);

const gracefulShutdown = async (msg, callback) => {
  await mongoose.connection.close();
  console.log(`Mongoose disconnected through ${msg}.`);
  callback();
};
process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart", () =>
    process.kill(process.pid, "SIGUSR2"),
  );
});
process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => process.exit(0));
});
process.on("SIGTERM", () => {
  gracefulShutdown("Cloud-based app shutdown", () => process.exit(0));
});

function debugClinics() {
  (async () => {
    try {
        const clinics = await mongoose.model("Clinic").find();
        console.log('debugClinic')
        console.log(clinics[3]);
    } catch (err) {
        console.log(err);
    }
  })()
};

function debugClient() {
  (async () => {
    try {
        const client = await mongoose.model("Client").find();
        console.log('debugClient')
        console.log(client);
    } catch (err) {
        console.log(err);
    }
  })()
};

function debugAppointments() {
  (async () => {
    try {
        const app = await mongoose.model("Appointment").find();
        console.log('debugAppointments')
        console.log(app);
    } catch (err) {
        console.log(err);
    }
  })()
};

function debugDB() {
  debugAppointments()
};

function populateDB() {
  setTimeout(async () => {
    try {
      // Read data from JSON files
      const jsonDataClients = await fs.readFile("./data/clients.json", "utf8");
      const clientsParsed = JSON.parse(jsonDataClients);
      await mongoose.model("Client").insertMany(clientsParsed);

      const jsonDataClinics = await fs.readFile("./data/clinics.json", "utf8");
      const clinicsParsed = JSON.parse(jsonDataClinics);
      await mongoose.model("Clinic").insertMany(clinicsParsed);

      const jsonDataAppointments = await fs.readFile(
        "./data/appointments.json",
        "utf8",
      );
      const appointmentsParsed = JSON.parse(jsonDataAppointments);
      await mongoose.model("Appointment").insertMany(appointmentsParsed);

      console.log("All data imported.")
    } catch (err) {
      console.log('err:', err)
    }
  }, 5000)
}

require("./schemas");
