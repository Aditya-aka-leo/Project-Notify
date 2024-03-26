const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "Notify",
  brokers: ["localhost:8097"],
});

const topicConfigurations = [
  { topic: "Validation", numPartitions: 1 },
  { topic: "high-priority", numPartitions: 5 },
  { topic: "mid-priority", numPartitions: 3 },
  { topic: "low-priority", numPartitions: 1 },
  { topic: "Sms", numPartitions: 2 },
  { topic: "Email", numPartitions: 2 },
  { topic: "Ivr", numPartitions: 2 },
  { topic: "Push-Notification", numPartitions: 2 },
];

const createTopics = async (admin) => {
  try {
    const data = await admin.listTopics();
    if (data.length != 0) {
      console.log("Topics Were Already Created");
      return;
    }
    await admin.createTopics({
      topics: topicConfigurations,
    });
    console.log("New topics created successfully");
  } catch (error) {
    console.error("Error creating topics:", error);
    throw error;
  }
};

const kafka_admin = async () => {
  const admin = kafka.admin();
  try {
    await admin.connect();
    console.log("Kafka Admin Connected Successfully");
    await createTopics(admin);
  } catch (error) {
    console.error("Error connecting with Kafka Admin Client:", error);
  } finally {
    await admin.disconnect();
  }
};

module.exports = { kafka_admin };
