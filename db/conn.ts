import { config } from '../config';
import * as AWS from 'aws-sdk';

AWS.config.update({ region: config.region, });

export const docClient = new AWS.DynamoDB.DocumentClient({
  region: config.region,
  endpoint: `https://dynamodb.${config.region}.amazonaws.com`,
  apiVersion: '2012-08-10',
});
