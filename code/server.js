// Load environment variables
require("dotenv").config();
const express = require("express");
const path = require("path");
require("./api/models/db.js");
const apiRouter = require("./api/routes/api");
const dbRouter = require("./api/routes/db");
const bodyParser = require("body-parser");
const cors = require("cors");



// Swagger in OpenAPI
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = swaggerJsDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "VetSplet",
      version: "0.1.0",
      description: "VetSplet REST API",
    },
    tags: [
      {
        name: "Database",
        description: "Database API",
      },
      {
        name: "Appointment",
        description: "Appointment API",
      },
      {
        name: "Client",
        description: "Client API",
      },
      {
        name: "Clinic",
        description: "Clinic API",
      },
      {
        name: "Employee",
        description: "Employee API",
      },
      {
        name: "Patient",
        description: "Patient API",
      },
      {
        name: "Transaction",
        description: "Transaction API",
      },
      {
        name: "AppointmentRequest",
        description: "AppointmentRequest API",
      },
    ],
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server for testing",
      },
      {
        url: "https://vetsplet.fly.dev",
        description: "Production server",
      }
    ],
    components: {
      schemas: {
        ErrorMessage: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message describing the error.",
            },
          },
          required: ["message"],
        },
      },
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./api/models/schemas.js", "./api/controllers/*.js", "./api/routes/db.js"],
});

// using compression middleware
const compression = require("compression");

// using morgan middleware
const morgan = require("morgan");

// Create server
const port = process.env.PORT || 3000;
const app = express();

// using compression middleware
app.use(compression());

// using morgan middleware
app.use(morgan('combined'));

// using cors middleware
app.use(cors());

// Serve Angular build
app.use("/ABI", express.static(path.join(__dirname, "dApp", "build", "contracts")));
app.use(express.static(path.join(__dirname, "angular", "build", "browser")));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// routing for /db
app.use("/api/db", dbRouter);

// api routing
app.use("/api", apiRouter);

// Catch-all route for Angular
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "angular", "build", "browser", "index.html"));
});

// swagger routing
apiRouter.get("/swagger.json", (req, res) =>
  res.status(200).json(swaggerDocument)
);
apiRouter.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

// Hanlding UnauthorizedError
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError")
    res.status(401).json({ message: err.message });
});

// Start server
app.listen(port, () => {
  console.log(
    `Vetsplet app started in ${
      process.env.NODE_ENV || "development"
    } mode listening on port ${port}!`,
  );
});