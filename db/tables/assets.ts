
import { docClient } from '../conn';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { MediaType } from '../../api/interfaces/nfts';
import PutItemInput = DocumentClient.PutItemInput;
import UpdateItemInput = DocumentClient.UpdateItemInput;
import AttributeUpdates = DocumentClient.AttributeUpdates;
import QueryInput = DocumentClient.QueryInput;

export interface ITblAsset {
  id: string; // uuid, Partition key
  type: MediaType;
  url: string;
  uploaderId: string; // user uuid
}

class AssetClientClass {
  private TBL_ASSETS = 'assets';

  public async getAsset(id: string): Promise<ITblAsset | undefined> {
    const queryData: QueryInput = {
      TableName: this.TBL_ASSETS,
      KeyConditionExpression: `#id=:idValue`,
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':idValue': id,
      },
    };
    const data = await docClient.query(queryData).promise();
    return data.Items[0] as ITblAsset;
  }

  public async insertAsset(item: ITblAsset): Promise<void> {
    const params: PutItemInput = {
      TableName: this.TBL_ASSETS,
      Item: item,
      ReturnValues: 'ALL_OLD',
    };
    const result = await docClient.put(params).promise();
    const { data, error, retryCount } = result.$response;
    if (error) {
      throw result.$response.error;
    }
    if (retryCount > 10) {
      throw new Error(`Too many retry count`);
    }
    if (data && Object.keys(data).length) {
      console.log('Old data exist with the same id', data);
    }
  }

  public async updateAsset(id: string, updateData: Partial<ITblAsset>): Promise<void> {
    const updateAttributesMap: AttributeUpdates = Object.keys(updateData).reduce((prev: AttributeUpdates, key) => {
      prev[key] = { Value: updateData[key] };
      return prev;
    }, {});
    const params: UpdateItemInput = {
      TableName: this.TBL_ASSETS,
      Key: { id },
      AttributeUpdates: updateAttributesMap,
      ReturnValues: 'UPDATED_NEW',
    };
    const result = await docClient.update(params).promise();
    const { data, error, retryCount } = result.$response;
    if (error) {
      throw result.$response.error;
    }
    if (retryCount > 10) {
      throw new Error(`Too many retry count`);
    }
    console.log('New updated data: ', data);
  }
}

export const assetClient = new AssetClientClass();
