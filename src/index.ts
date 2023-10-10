import { Handler } from "aws-lambda";
import { response } from "./utils";
import { Connection, In, Not } from "typeorm";
import { dni } from "../src/utils/dni";
import {
  notPremiumExist,
  premiumExist,
  payloadUserPrime,
  payloadUserPrimeUnsubscribe,
  payloadUserPrimeBlock,
  enableUser,
  premiumNotExist,
  premiumNotExistFile,
  emailByCampanin,
  arrayChangeStatus,
} from "./helpers/bulk_upload.helper";

import * as path from "path";

import init from "./entities";
import {
  User,
  PremiumUser,
  PremiumCompanies,
  PremiumUserT,
} from "./entities/entity";
import fs from "fs";
import csv from "csv-parser";

export const handler: Handler = async (event, context) => {
  const body = event.body ? event.body : event;
  const connection: Connection = await init();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  const userRepository = connection.getRepository(User);
  const premiumUserRepository = connection.getRepository(PremiumUser);
  const premiumUserRepositoryT = connection.getRepository(PremiumUserT);
  const premiumCompaniesRepository = connection.getRepository(PremiumCompanies);
  const dnis = dni().join(",");

  console.log("dnis", dnis);

  try {
    const results = [];
    const ruts = [];
    const rutArray = [];
    console.log("__dirname", __dirname);

    const premiumCompaniesPreviousSegmentation =
      await premiumCompaniesRepository.find({
        order: {
          created_at: "DESC",
        },
        take: 2,
      });

    const bonusCustomerMaintainsMembership = async () => {
      const previousEmailSegmentation = await userRepository
        .createQueryBuilder("users")
        .innerJoin(
          "premium_users",
          "p",
          `p.dni = users.dni and p.promotion_company_id = ${premiumCompanies[0].id}`
        )
        .where(`users.status = 2`)
        .andWhere(
          `p.dni IN(select pu.dni from premium_users pu inner join users us on us.dni=pu.dni where us.status=2 and pu.promotion_company_id = ${premiumCompaniesPreviousSegmentation[1].id})`
        )
        .andWhere(
          `users.dni NOT IN(select pu.dni from premium_users pu inner join users us on us.dni=pu.dni where us.status=2 and pu.promotion_company_id = 2)`
        )
        .andWhere(`users.dni NOT IN(select pu.dni from premium_users_t pu)`)
        .select([
          "users.id as id_user",
          "users.email as email",
          "users.benefit_end_date as benefit_end_date",
          "p.id as id_premium_user",
          "users.first_name as first_name",
        ])
        .getRawMany();
      console.log("26mailingJPBonificadomantiene");
      console.log(previousEmailSegmentation);
      console.log("26mailingJPBonificadomantiene");
      if (previousEmailSegmentation.length > 0) {
        await emailByCampanin(
          previousEmailSegmentation,
          "26mailingJPBonificadomantiene",
          premiumCompanies[0]
        );
      }
      return true;
    };

    //Notificar a cliente que ahora es prime bonificado
    const notBonusCustomerLeaves = async () => {
      const nothasPrime = await userRepository
        .createQueryBuilder("users")
        .innerJoin(
          "premium_users",
          "p",
          `p.dni = users.dni and p.promotion_company_id = ${premiumCompanies[0].id}`
        )
        .where(`users.status = 2`)
        .andWhere(
          `p.dni NOT IN (select pu.dni from premium_users pu inner join users us on us.dni=pu.dni where us.status=2 and pu.promotion_company_id = ${premiumCompaniesPreviousSegmentation[1].id})`
        )
        .andWhere(
          `users.dni NOT IN(select pu.dni from premium_users pu inner join users us on us.dni=pu.dni where us.status=2 and pu.promotion_company_id = 2)`
        )
        .andWhere(`users.dni NOT IN(select pu.dni from premium_users_t pu)`)
        .select([
          "users.id as id_user",
          "p.email as email",
          "users.benefit_end_date as benefit_end_date",
          "p.id as id_premium_user",
          "users.first_name as first_name",
        ])
        .getRawMany();
      console.log("25mailingJPBonificadoprime");
      console.log(nothasPrime);
      console.log("25mailingJPBonificadoprime");
      if (nothasPrime.length > 0) {
        await emailByCampanin(
          nothasPrime,
          "25mailingJPBonificadoprime",
          premiumCompanies[0]
        );
      }
    };

    //Se envia correo a clientes que fueron prime
    const bonusCustomerLeaves = async () => {
      const hasPrime = await userRepository
        .createQueryBuilder("users")
        .innerJoin(
          "premium_users",
          "p",
          `p.dni = users.dni and p.promotion_company_id = ${premiumCompanies[0].id}`
        )
        .where(`users.status in(7,6)`)
        .andWhere(
          `users.dni NOT IN(select pu.dni from premium_users pu inner join users us on us.dni=pu.dni where us.status=2 and pu.promotion_company_id = 2)`
        )
        .andWhere(`users.dni NOT IN(select pu.dni from premium_users_t pu)`)
        .select([
          "users.id as id_user",
          "p.email as email",
          "users.benefit_end_date as benefit_end_date",
          "p.id as id_premium_user",
          "users.first_name as first_name",
        ])
        .getRawMany();
      console.log("24mailingJPBonificadoprimebaja");
      console.log(hasPrime);
      console.log("24mailingJPBonificadoprimebaja");
      if (hasPrime.length > 0) {
        await emailByCampanin(
          hasPrime,
          "24mailingJPBonificadoprimebaja",
          premiumCompanies[0]
        );
      }
    };

    //Se envia correo a clientes que son bonificados por primera vez
    const bonusCustomer = async () => {
      const previousEmailSegmentation = await premiumUserRepository
        .createQueryBuilder("premium_users")
        .leftJoin(
          "users",
          "u",
          `premium_users.dni = u.dni and premium_users.promotion_company_id = ${premiumCompanies[0].id}`
        )
        .where(
          `premium_users.user_id is null and u.id is null and premium_users.promotion_company_id = ${premiumCompanies[0].id}`
        )
        .andWhere(
          `premium_users.dni NOT IN(select pu.dni from premium_users pu inner join users us on us.dni=pu.dni where us.status=2 and pu.promotion_company_id = 2)`
        )
        .andWhere(
          `premium_users.dni NOT IN(select pu.dni from premium_users_t pu)`
        )
        .select([
          "premium_users.first_name as first_name",
          "premium_users.id as id_premium_user",
          "premium_users.email as email",
        ])
        .getRawMany();

      console.log("--23mailingJPBonificadonoprime---");
      console.log(previousEmailSegmentation);
      console.log("--23mailingJPBonificadonoprime--");
      if (previousEmailSegmentation.length > 0) {
        await emailByCampanin(
          previousEmailSegmentation,
          "23mailingJPBonificadonoprime",
          premiumCompanies[0]
        );
      }
      return true;
    };
    const premiumCompanies = await premiumCompaniesRepository.find({
      order: {
        created_at: "DESC",
      },
      take: 1,
    });

    if (premiumCompanies.length === 0) {
      throw new Error("La campaña no existe");
    }

    const readCSVFile = (): any => {
      return new Promise((resolve, reject) => {
        const results = [];
        const ruts = [];
        const rutArray = [];

        fs.createReadStream(
          path.join(__dirname, "../../src/utils/segmentaciones_new.csv")
        )
          .pipe(csv())
          .on("data", (data) => {
            results.push(data);
          })
          .on("end", () => {
            for (let element of results) {
              ruts.push("'" + element.dni + "'");
              rutArray.push(element.dni);
            }
            resolve({ results, ruts, rutArray });
          })
          .on("error", (error) => {
            reject(error);
          });
      });
    };
    //Se envia correo a clientes que mantiene los beneficios.
    const dataArrayObject = await readCSVFile();
    const numbertotalSave = 5000;
    let total = 0;
    let index = 0;
    let resultNotPremium = [];
    console.log(body);
    console.log(dataArrayObject.results.length);
    let resultPremiumNotIn = [];
    if (body.process == "upload") {
      if (dataArrayObject.results.length > 0) {
        if (dataArrayObject.results.length > numbertotalSave) {
          let result = dataArrayObject.results.length;
          let div = Math.ceil(dataArrayObject.results.length / numbertotalSave);
          for (let i = 0; i < div; i++) {
            if (result < numbertotalSave) {
              total = total + result;
              index = total - result;
            } else {
              total = total + numbertotalSave;
            }
            resultNotPremium = notPremiumExist(
              dataArrayObject.results,
              premiumCompanies,
              total,
              index
            );
            index = index + numbertotalSave;
            result = result - 5000;
            if (resultNotPremium.length >= 0) {
              await queryRunner.manager.save(PremiumUserT, resultNotPremium);
            }
          }
        } else {
          console.log(JSON.stringify(resultNotPremium));
          console.log({ resultNotPremium });
          resultNotPremium = notPremiumExist(
            dataArrayObject.results,
            premiumCompanies,
            dataArrayObject.results.length,
            0
          );
          if (resultNotPremium.length >= 0) {
            await queryRunner.manager.save(PremiumUserT, resultNotPremium);
          }
        }
      }
      console.log("resultNotPremium");
      console.log(resultNotPremium);
      console.log("resultNotPremium");
      console.log("________Finnnn");
      await queryRunner.commitTransaction();
      return response(200, true, "", {});
    } else {
      resultPremiumNotIn = await userRepository
        .createQueryBuilder("users")
        .leftJoin(
          "premium_users",
          "p",
          `p.dni = users.dni and p.promotion_company_id = ${premiumCompanies[0].id}`
        )
        .where(
          `users.card_brand = 'PREMIUM' and users.status = 2 and p.id is null`
        )
        .andWhere(
          `users.dni NOT IN(select pu.dni from premium_users pu inner join users us on us.dni=pu.dni where us.status=2 and pu.promotion_company_id = 2)`
        )
        .select([
          "users.id as id_user",
          "users.benefit_end_date as benefit_end_date",
          "p.id as id_premium_user",
        ])
        .getRawMany();

      console.log("resultPremiumNotIn", resultPremiumNotIn.length);

      if (resultPremiumNotIn.length > 0) {
        const dataPremiumNotExist = await premiumNotExist(resultPremiumNotIn);
        console.log("dataPremiumNotExist", dataPremiumNotExist);
        //await queryRunner.manager.save(User, dataPremiumNotExist);
      }
      const premiumInt = await premiumUserRepository
        .createQueryBuilder("premium_users")
        .innerJoin("users", "u", "u.dni = premium_users.dni") // asumiendo que ambas tablas tienen un campo `id`
        .where(
          `u.status=2 and promotion_company_id = ${premiumCompanies[0].id}`
        )
        .andWhere(
          `u.dni NOT IN(select pu.dni from premium_users pu inner join users us on us.dni=pu.dni where us.status=2 and pu.promotion_company_id = 2)`
        )
        .select([
          "u.benefit_end_date",
          "u.id as id_user",
          "u.status",
          "premium_users.id as id_premium_user",
        ])
        .getRawMany();

      const resultPremium = premiumExist(premiumInt, premiumCompanies);
      console.log("resultPremium");
      console.log("premiumInt", premiumInt.length);
      console.log(resultPremium);
      console.log("resultPremium");
      if (resultPremium.dataPremium.length >= 0) {
        //await queryRunner.manager.save(PremiumUser, resultPremium.dataPremium);
        //await queryRunner.manager.save(User, resultPremium.dataUser);
      }
      //await queryRunner.commitTransaction();
      console.log("Correosss");
      await Promise.all([
        bonusCustomerMaintainsMembership(),
        //bonusCustomer(),
        bonusCustomerLeaves(),
        notBonusCustomerLeaves(),
      ]);

      return response(200, true, "", {});
    }
  } catch (error) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    console.log("error", error);
    return response(500, false, error.message, error.stack);
  } finally {
    connection.close();
  }
};
