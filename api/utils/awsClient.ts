import * as AWS from 'aws-sdk';
import { config } from '../../config';

export const s3 = new AWS.S3({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
  signatureVersion: 'v4',
});

export const getPublicUrl = (objectKey: string) => `https://s3.${config.region}.amazonaws.com/${config.s3Bucket}/${objectKey}`;
