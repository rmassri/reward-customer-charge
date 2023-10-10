import { SecretsManager } from "aws-sdk";

class SecretManager {
  static async getSecret(secretName: string) {
    if (process.env.ENV === "local") {
      switch (secretName) {
        case "ENV_DB_SECRET":
          return {
            db_jumboprime_host: process.env.DB_HOST,
            db_jumboprime_port: process.env.DB_PORT,
            db_jumboprime_user: process.env.DB_USER,
            db_jumboprime_password: process.env.DB_PASS,
            db_jumboprime_database: process.env.DB_NAME,
          };

        default:
          return {
            PAYMENT_CORE_URL: process.env.PAYMENT_CORE_URL,
            PAYMENT_APY_KEY: process.env.PAYMENT_APY_KEY,
          };
      }
    }

    const secretsManager: SecretsManager = new SecretsManager({
      region: "us-east-1",
    });
    try {
      const secretValue = await secretsManager
        .getSecretValue({ SecretId: secretName })
        .promise();
      if ("SecretString" in secretValue) {
        return JSON.parse(secretValue.SecretString);
      }

      return null;
    } catch (err) {
      console.log("Error on get secrets: ", err);
    }
  }
}
export default SecretManager;
