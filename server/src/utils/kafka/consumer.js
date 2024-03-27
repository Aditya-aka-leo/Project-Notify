const { Kafka } = require('kafkajs');
const { Kafka } = require('kafkajs');

async function run() {
    const kafka = new Kafka({
        clientId: 'my-kafka-consumer',
        brokers: ['localhost:9092'] // Replace with your Kafka broker(s) address
    });

    const consumer = kafka.consumer({ groupId: 'my-consumer-group' });

    await consumer.connect();

    const topic = 'valid';

    await consumer.subscribe({ topic });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                topic,
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
        },
    });

    // Keep the consumer running indefinitely
    // await consumer.run();

    // Disconnect the consumer when done
    // await consumer.disconnect();
}

run().catch(console.error);