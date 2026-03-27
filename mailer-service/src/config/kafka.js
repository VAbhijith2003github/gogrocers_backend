const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "gogrocers-mailer",
  brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',').map(b => b.trim().replace(/['"]/g, '')) : [],
  ssl: true,
  sasl: {
    mechanism: process.env.KAFKA_SASL_MECHANISM || "scram-sha-256",
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD,
  },
});

module.exports = kafka;
