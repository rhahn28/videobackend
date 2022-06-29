import * as express from 'express';

const router = express.Router();

 router.get('/url/:url', async (req, res, next) => {
  const { url } = req.params;

});


 router.put('/:assetId', async (req, res, next) => {

});

export default router;
