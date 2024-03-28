const { Kafka } = require("kafkajs");
const {
  Validator_Prioritizer_Prod,
  Service_Selector_Prod,
  Service_Selector_Prod_Bulk,
} = require("../../controller/controller");
const { send_email } = require("../../utils/Email/email");
const { send_sms } = require("../../utils/Sms/sms");
const { send_ivr } = require("../../utils/Ivr/ivr");
const {
  send_push_notification,
} = require("../../utils/Push Notification/push_notification");
const kafka = new Kafka({
  brokers: ["localhost:8097"],
});

const consume = async (topic, consumer) => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  consumer
    .connect()
    .then(() => {
      console.log(`Consumer Connected To The ${topic} Queue`);
    })
    .catch((err) => {
      console.log(`Failed Consumer Connected To The ${topic} Queue`, err);
    });
};

const run_consumer = async (consumer, next_prod) => {
  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      const payload = JSON.parse(message.value.toString());
      // console.log("payload is : ", payload);
      console.log(`Msg Pulled From ${topic} Queue`);
      next_prod(payload);
    },
  });
};
const run = async () => {
  const email_consumer = kafka.consumer({ groupId: "Emailer" });
  const sms_consumer = kafka.consumer({ groupId: "SMS" });
  const Ivr_consumer = kafka.consumer({ groupId: "IVR" });
  const Push_Notification_consumer = kafka.consumer({
    groupId: "Push Notificaiton",
  });
  const Validation_consumer = kafka.consumer({ groupId: "Validation" });
  const High_Priority_consumer = kafka.consumer({ groupId: "High-p" });
  const Mid_Priority_consumer = kafka.consumer({ groupId: "Low-p" });
  const Low_Priority_consumer = kafka.consumer({ groupId: "Mid-p" });

  await consume("Push-Notification", Push_Notification_consumer);
  await consume("Ivr", Ivr_consumer);
  await consume("Sms", sms_consumer);
  await consume("Email", email_consumer);
  await consume("High-priority", High_Priority_consumer);
  await consume("Mid-priority", Mid_Priority_consumer);
  await consume("Low-priority", Low_Priority_consumer);
  await consume("Validation", Validation_consumer);
  run_consumer(Push_Notification_consumer, send_push_notification);
  run_consumer(Ivr_consumer, send_ivr);
  run_consumer(sms_consumer, send_sms);
  run_consumer(email_consumer, send_email);
  run_consumer(Validation_consumer, Validator_Prioritizer_Prod);
  run_consumer(High_Priority_consumer, Service_Selector_Prod);
  run_consumer(Mid_Priority_consumer, Service_Selector_Prod);
  run_consumer(Low_Priority_consumer, Service_Selector_Prod_Bulk);
};
module.exports = { run };

