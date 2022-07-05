export const config = {
  isLocal: process.env.IS_OFFLINE && process.env.IS_OFFLINE === 'true',
  stage: process.env.STAGE,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  s3Bucket: process.env.S3_BUCKET_NAME,
  swagger: {
    path: '/swagger',
    docsPath: '/api',
  },
};
