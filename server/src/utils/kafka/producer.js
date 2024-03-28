const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "Notify",
  brokers: ["localhost:8097"],
});

const produceMessage = async (topic, msg) => {
  const producer = kafka.producer();
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(msg) }],
    });
    console.log(`Added To the ${topic} Queue Successfully`);
  } catch (err) {
    console.error(`Error sending message to topic ${topic}:`, err);
  }
};
module.exports = { produceMessage };
