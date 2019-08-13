import { Router } from 'express';
import { CompressionTypes } from 'kafkajs'

const routes = new Router();

const message = {
  user: { id: 1, name: 'Nicolas' },
  course: "React",
  grade: 5,
};

routes.post('/certifications', async (req, res) => {
  try {
    await req.producer.send({
      topic: 'issue-certificate',
      compression: CompressionTypes.GZIP,
      messages: [
        { value: JSON.stringify(message) }
      ],
    });

    // Chamar micro servico
    return res.json({ message: true });
  } catch (err) {
    console.log('err: ', err);
    return res.status(500).send("Error");
  }
});

export default routes;
