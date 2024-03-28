const { Kafka } = require("kafkajs");
const {
  Validator_Prioritizer_Prod,
  Service_Selector_Prod,
  Service_Selector_Prod_Bulk,
} = require("../../controller/controller");

const consume = async (topic) => {
  const kafka = new Kafka({
    brokers: ["localhost:8097"],
  });

  const consumer = kafka.consumer({groupId:'notify-group'});

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, msg }) => {
      console.log(`Received message on topic ${topic}`);
      const messageString = msg.toString();
      const messageObject = JSON.parse(messageString);
      return messageObject;
    },
  });
};

const Validator_Consumer = async () => {
  try {
    const msg = await consume("Validation");

    await Validator_Prioritizer_Prod(msg);
  } catch (err) {
    console.log("Error consuming messages from Validation topic", err);
  }
};

const High_Priority_Consumer = async () => {
  try {
    const msg = await consume("High-priority");
    await Service_Selector_Prod(msg);
  } catch (err) {
    console.log("Error consuming messages from High-priority topic", err);
  }
};
const Mid_Priority_Consumer = async () => {
  try {
    const msg = await consume("Mid-priority");
    await Service_Selector_Prod(msg);
  } catch (err) {
    console.log("Error consuming messages from Mid-priority topic", err);
  }
};
const Low_Priority_Consumer = async () => {
  try {
    const msg = await consume("Low-priority");
    await Service_Selector_Prod_Bulk(msg);
  } catch (err) {
    console.log("Error consuming messages from High-priority topic", err);
  }
};

const run_consumer = async () => {
  await Validator_Consumer();
  await High_Priority_Consumer();
  await Mid_Priority_Consumer();
  await Low_Priority_Consumer();
};
module.exports = { run_consumer };
