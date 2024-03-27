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
    console.log('Validation Successfull And Added To the Queue');
  } catch (err) {
    console.error(`Error sending message to topic ${topic}:`, err);
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

const prodServiceSelector = async (topic, msg) => {
  const producer = kafka.producer();
  try {
    const topicMessages = [
      { topic: "Sms", messages: [{ value: msg }] },
      { topic: "Email", messages: [{ value: msg }] },
      { topic: "Ivr", messages: [{ value: msg }] },
      { topic: "Push-Notification", messages: [{ value: msg }] },
    ];
    await producer.sendBatch({ topicMessages });
  } catch (err) {
    console.log("error in service Selection", err);
  }
};
module.exports = { prodPrioritizer, prodValidator, prodServiceSelector };
