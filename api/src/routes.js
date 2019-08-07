import { Router } from 'express';

const routes = new Router();

routes.post('/certifications', async (req, res) => {
  console.log('producer: ', req.producer);
  // Chamar micro servico
  return res.json({ message: true });
});

export default Router;