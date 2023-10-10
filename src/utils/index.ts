import IBodyResponse from "./body.response.interface";
import { SecretsManager } from "aws-sdk";

export const response = (
  statusCode: number,
  success: boolean,
  message?: string | string[],
  data: any = null
) => {
  const response: IBodyResponse = {
    code: statusCode,
    success: success,
  };
  if (message) {
    response.message = message;
  }
  if (success) {
    response.data = data;
  } else {
    response.error = data;
  }

  return response;
};
export const getSecret = async () => {
  if (process.env.NODE_ENV === "local") {
    return JSON.stringify({
      db_jumboprime_host: process.env.DB_HOST,
      db_jumboprime_port: process.env.DB_PORT,
      db_jumboprime_user: process.env.DB_USER,
      db_jumboprime_password: process.env.DB_PASS,
      db_jumboprime_database: process.env.DB_NAME,
    });
  }
  const secretName: string = process.env.ENV_DB_SECRET;
  const client: SecretsManager = new SecretsManager({
    region: "us-east-1",
  });
  const response: any = await client
    .getSecretValue({ SecretId: secretName })
    .promise();

  //what is left is to return the right data
  if ("SecretString" in response) {
    return response.SecretString;
  }

  return {};
};

export const getSecretBff = async (secret: string) => {
  if (process.env.NODE_ENV === "local") {
    return {
      url: process.env.BFF_URL,
      apikey: process.env.BFF_APIKEY,
    };
  }

  const client: SecretsManager = new SecretsManager({
    region: process.env.REGION_AWS,
  });
  const response: any = await client
    .getSecretValue({ SecretId: secret })
    .promise();
  return JSON.parse(response.SecretString);
};
