import * as express from 'express';
import { isUuid } from 'uuidv4';
import { config } from '../../config';
import { BadRequestError } from '../utils/errors';
import { getPublicUrl, s3 } from '../utils/awsClient';

const router = express.Router();

/**
 * @openapi
 * /assets/url/{url}:
 *   get:
 *     tags:
 *       - Assets
 *     description: Asana - 1010, Get pre-signed upload url for asset(image and audio)
 *     parameters:
 *       -
 *         name: url
 *         in: path
 *         required: true
 *         description: unique file id(uuid), if duplicated, overrides the file on S3
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns preSignedUrl, expiresIn and publicUrl. publicUrl should display the proper one after uploading image/audio against pre-signed url
 *       401:
 *         description: Unauthorized Error
 *       403:
 *         description: Forbidden Error
 *       500:
 *         description: Internal Server Error
 */
 router.get('/url/:url', async (req, res, next) => {
  const { url } = req.params;
  if (!url) return next(new BadRequestError(`Invalid url with uuid`));
  try {
    const expiresIn = 300; // in minutes
    const s3Params = {
      Bucket: config.s3Bucket,
      Key: url,
      Expires: expiresIn,
    };

    const preSignedUrl: string = s3.getSignedUrl('getObject', s3Params);
    res.send({ preSignedUrl });
  } catch (e) {
    next(e);
  }
});

/**
 * @openapi
 * /assets/{assetId}:
 *   put:
 *     tags:
 *       - Assets
 *     description: Asana - 1010, Get pre-signed upload url for asset(image and audio)
 *     parameters:
 *       -
 *         name: assetId
 *         in: path
 *         required: true
 *         description: unique file id(uuid), if duplicated, overrides the file on S3
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mediaType:
 *                 type: string
 *                 required: true
 *                 description: the file's media type, acceptable values - `IMAGE` and `AUDIO`
 *     responses:
 *       200:
 *         description: Returns preSignedUrl, expiresIn and publicUrl. publicUrl should display the proper one after uploading image/audio against pre-signed url
 *       401:
 *         description: Unauthorized Error
 *       403:
 *         description: Forbidden Error
 *       500:
 *         description: Internal Server Error
 */
 router.put('/:assetId', async (req, res, next) => {
  const { assetId } = req.params;
  if (!assetId || !isUuid(assetId)) return next(new BadRequestError(`Invalid assetId with uuid type: ${assetId}`));
  const { mediaType } = req.body;
  // if (!mediaType || !Object.values(MediaType).includes(mediaType))
  //   return next(new BadRequestError(`Invalid mediaType : ${mediaType}`));
  try {
    const expiresIn = 300; // in minutes
    const s3ObjectKey = `assets/${assetId}`;
    const s3Params = {
      Bucket: config.s3Bucket,
      Key: s3ObjectKey,
      ContentType: 'multipart/form-data',
      Expires: expiresIn,
    };

    const preSignedUrl: string = s3.getSignedUrl('putObject', s3Params);
    res.send({ preSignedUrl, expiresIn });
  } catch (e) {
    next(e);
  }
});

export default router;
