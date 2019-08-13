import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  clientId: "certificate",
  brokers: ['localhost:9092'],
  logLevel: logLevel.NOTHING
});

const topic = 'issue-certificate';
const consumer = kafka.consumer({ groupId: 'certificate-group' });

const producer = kafka.producer();

let counter = 0;

async function run() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      setTimeout(async () => {
        counter++;
        await producer.send({
          topic: 'certification-response',
          messages: [
            { value: `Certificado #${counter} gerado!` }
          ]
        });
      }, 3000);
      console.log(`value: ${message.value}`);
    }
  })
};
run().catch(console.error);
