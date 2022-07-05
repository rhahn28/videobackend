import { docClient } from '../conn';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import PutItemInput = DocumentClient.PutItemInput;
import UpdateItemInput = DocumentClient.UpdateItemInput;
import AttributeUpdates = DocumentClient.AttributeUpdates;
import QueryInput = DocumentClient.QueryInput;
import ScanInput = DocumentClient.ScanInput;

export interface ITblUser {
  id: string; // Partition key
  phone: string;
  session: string;
  name?: string;
  username?: string;
  email?: string;
  profileImage?: string;
  credits: number;
  verified: boolean;
}

class UserClientClass {
  private TBL_USERS = 'users';

  public async getUser(id: string): Promise<ITblUser | undefined> {
    const queryData: QueryInput = {
      TableName: this.TBL_USERS,
      KeyConditionExpression: `#id=:idValue`,
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':idValue': id,
      },
    };
    const data = await docClient.query(queryData).promise();
    return data.Items[0] as ITblUser;
  }

  public async getUserByPhone(phone: string): Promise<ITblUser | undefined> {
    const scanData: ScanInput = {
      TableName: this.TBL_USERS,
      FilterExpression: `#phone=:phoneValue`,
      ExpressionAttributeNames: {
        "#phone": "phone"
      },
      ExpressionAttributeValues: {
        ":phoneValue": phone,
      },
    };
    const data = await docClient.scan(scanData).promise();
    return data.Items[0] as ITblUser;
  }

  public async getUserByUsername(username: string): Promise<ITblUser | undefined> {
    const scanData: ScanInput = {
      TableName: this.TBL_USERS,
      FilterExpression: `#username=:usernameValue`,
      ExpressionAttributeNames: {
        "#username": "username"
      },
      ExpressionAttributeValues: {
        ":usernameValue": username,
      },
    };
    const data = await docClient.scan(scanData).promise();
    return data.Items[0] as ITblUser;
  }

  public async insertUser(item: ITblUser): Promise<void> {
    const params: PutItemInput = {
      TableName: this.TBL_USERS,
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

  public async updateUser(id: string, updateData: Partial<ITblUser>): Promise<void> {
    const updateAttributesMap: AttributeUpdates = Object.keys(updateData).reduce((prev: AttributeUpdates, key) => {
      prev[key] = { Value: updateData[key] };
      return prev;
    }, {});
    const params: UpdateItemInput = {
      TableName: this.TBL_USERS,
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

export const userClient = new UserClientClass();
