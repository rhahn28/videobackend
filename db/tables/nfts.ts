import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { docClient } from '../conn';
import { NFTType } from '../../api/interfaces/nfts';
import PutItemInput = DocumentClient.PutItemInput;
import UpdateItemInput = DocumentClient.UpdateItemInput;
import AttributeUpdates = DocumentClient.AttributeUpdates;
import QueryInput = DocumentClient.QueryInput;
import ScanInput = DocumentClient.ScanInput;

export interface ITblNft {
  id: string; // uuid, Partition key
  type: NFTType;
  metadata: string; // Token uri metadata json used for minting
  description: string;
  price: number;
  royalty: number; // Percentage
  quantity: number;
  saleEndedAt: number; // Timestamp
  isMinted: boolean;
  minterId: string; // user uuid
}

class NftClientClass {
  private TBL_NFTS = 'nfts';

  public async getNft(id: string): Promise<ITblNft | undefined> {
    const queryData: QueryInput = {
      TableName: this.TBL_NFTS,
      KeyConditionExpression: `#id=:idValue`,
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':idValue': id,
      },
    };
    const data = await docClient.query(queryData).promise();
    return data.Items[0] as ITblNft;
  }

  public async getNfts(minterId: string, isMinted: boolean): Promise<ITblNft[]> {
    const scanData: ScanInput = {
      TableName: this.TBL_NFTS,
      FilterExpression: `#n0 = :v0 AND #n1 = :v1`,
      ExpressionAttributeNames: {
        '#n0': 'isMinted',
        '#n1': 'minterId',
      },
      ExpressionAttributeValues: {
        ':v0': isMinted,
        ':v1': minterId,
      },
    };
    const data = await docClient.scan(scanData).promise();
    return data.Items as ITblNft[];
  }

  public async insertNft(item: ITblNft): Promise<void> {
    const params: PutItemInput = {
      TableName: this.TBL_NFTS,
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

  public async updateNft(id: string, updateData: Partial<ITblNft>): Promise<void> {
    const updateAttributesMap: AttributeUpdates = Object.keys(updateData).reduce((prev: AttributeUpdates, key) => {
      prev[key] = { Value: updateData[key] };
      return prev;
    }, {});
    const params: UpdateItemInput = {
      TableName: this.TBL_NFTS,
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

export const nftClient = new NftClientClass();
