import express from 'express';
import { Kafka, logLevel } from 'kafkajs';

const PORT = 4000;

import routes from './routes';

const app = express();

app.use(express.json());

const kafka = new Kafka({
  clientId: "api",
  brokers: ['kafka:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
  logLevel: logLevel.NOTHING
});

const topic = 'certification-response';

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'certificate-group1' });

async function run() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`value: ${message.value}`);
    }
  });

  app.use((req, res, next) => {
    req.producer = producer;
    return next();
  });

  app.use(routes);

  app.listen(PORT);
}

run().then(() => console.log(`Running on port: ${PORT}`)).catch(console.error);
