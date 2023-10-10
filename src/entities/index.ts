import { Connection, createConnection } from "typeorm";
import { getSecret } from "../utils";
import { User } from "./user.entity";
import { TransactionFiserv } from "./transactionFiserv.entity";
import { ParametersConfig } from "./parameterConfig.entity";
import { PremiumUser } from "./premiumUser.entity";
import { PremiumUserT } from "./premiumUserT.entity";
import { PremiumCompanies } from "./premiumCompanies.entity";
import { UserCore } from "./userCore.entity";
import { Card } from "./card.entity";

const init = async () => {
  const secretString: string = await getSecret();
  const secretData = JSON.parse(secretString);
  console.log("secretData", secretData);
  const connection: Connection = await createConnection({
    type: "postgres",
    name: "api-logged-user",
    host: secretData.db_jumboprime_host,
    port: secretData.db_jumboprime_port,
    username: secretData.db_jumboprime_user,
    password: secretData.db_jumboprime_password,
    database: secretData.db_jumboprime_database,
    entities: [
      PremiumUser,
      User,
      TransactionFiserv,
      ParametersConfig,
      UserCore,
      Card,
      PremiumCompanies,
      PremiumUserT,
    ],
    //logging: ["query", "error"],
  });

  return connection;
};

export default init;
