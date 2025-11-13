// load .env into process.env
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const { Kafka } = require("kafkajs");

const app = express();

// CORS configuration - allow requests from frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json());

// config via env (values come from process.env, dotenv loads .env)
const PORT = process.env.PORT || 4000;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/postgres",
});

// silence KafkaJS partitioner warning (optional)
process.env.KAFKAJS_NO_PARTITIONER_WARNING = "1";

// Kafka setup (expects brokers in env or docker-compose)
const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});
const producer = kafka.producer();

// kafka availability flag and reconnect helper
let kafkaAvailable = false;
const kafkaState = {
  isAvailable: () => kafkaAvailable,
  setAvailable: (val) => {
    kafkaAvailable = val;
  },
  tryConnect: (retries = 0) => {
    producer
      .connect()
      .then(() => {
        kafkaAvailable = true;
        console.log("Kafka producer connected");
      })
      .catch((err) => {
        kafkaAvailable = false;
        console.warn(
          "Kafka connect failed, will retry",
          err && err.message ? err.message : err
        );
        const backoff = Math.min(30000, 1000 * Math.pow(2, retries)); // cap at 30s
        setTimeout(() => kafkaState.tryConnect(retries + 1), backoff);
      });
  },
};

// models
const models = require("./models");

// initialize DB tables, start background kafka connect (non-blocking)
async function init() {
  // In development, you might want to reset the DB on each start.
  // Be careful with this in production!
  if (process.env.NODE_ENV === "development") {
    await models._dangerouslyDropAndRecreateTables(pool);
  } else {
    // In production, just ensure tables exist.
    await models.init(pool);
  }

  // try to connect producer in background (do NOT await, so startup doesn't fail)
  kafkaState.tryConnect();
}
init().catch((err) => {
  console.error("Initialization failed", err);
  process.exit(1);
});

// ROUTES
const apiRoutes = require("./routes")(pool, models, producer, kafkaState);
app.use("/api", apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
