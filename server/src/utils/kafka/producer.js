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
  } catch (err) {
    console.error(`Error sending message to topic ${topic}:`, err);
  } finally {
    await producer.disconnect();
  }
};

const prodValidator = async (msg) => {
  await produceMessage("Validation", msg);
};

const prodPrioritizer = async (msg) => {
  let topic;
  switch (msg.priority) {
    case 0:
      topic = "high-priority";
      break;
    case 1:
      topic = "mid-priority";
      break;
    default:
      topic = "low-priority";
  }
  await produceMessage(topic, msg);
};

module.exports = { prodPrioritizer, prodValidator };
