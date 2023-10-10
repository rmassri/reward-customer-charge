import moment from "moment";
import axios from "axios";
import { getSecretBff } from "../utils/secrets";
import { sqsRequestEmail } from "../utils/sqs.email";
import { principalFunctionSendEmail } from "../utils/sendEmail";
import { PremiumCompanies } from "../entities/premiumCompanies.entity";

export const oldBaseClient = (users) => {};

export const premiumExist = (premiumIn, premiumCompanies) => {
  const dataUser = [];
  const dataPremium = [];
  for (let element of premiumIn) {
    dataUser.push({
      id: element.id_user,
      benefit_end_date: premiumCompanies[0].end_date,
      role: "0",
      card_brand: "PREMIUM",
      card_bin: "9999",
      card_last_digits: null,
      status: 2,
    });
    dataPremium.push({
      id: element.id_premium_user,
      user_id: element.id_user,
    });
  }
  return { dataUser, dataPremium };
};

export const arrayChangeStatus = (premiumIn) => {
  const dataUser = [];
  for (let element of premiumIn) {
    dataUser.push({
      id: element.id_user,
      status: 0,
    });
  }
  return dataUser;
};

export const premiumNotExistFile = (userNotExiste) => {
  const dataDniPush = [];
  for (let element of userNotExiste) {
    dataDniPush.push(element.dni);
  }
  return dataDniPush;
};

export const premiumNotExist = async (notExiste) => {
  const dataUser = [];
  const sqsEmail = [];
  for (let element of notExiste) {
    dataUser.push({
      id: element.id_user,
      benefit_end_date: new Date(),
      role: "0",
    });
  }
  return dataUser;
};

export const emailByCampanin = async (
  data,
  nameCampain = "",
  premiumCompanies
) => {
  const sqsEmail = [];
  for (let element of data) {
    const optionalData = [
      {
        name: "NOMBRE",
        value: element.first_name,
      },
      {
        name: "FECHA_INICIO_BONIFICACION",
        value: moment(new Date()).format("DD/MM/YYYY"),
      },
      {
        name: "FECHA_FIN_BONIFICACION",
        value: moment(premiumCompanies.end_date).format("DD/MM/YYYY"),
      },
    ];
    //const dataPayload = dataBody(optionalData, element.email);
    sqsEmail.push(sqsRequestEmail(element, nameCampain, optionalData));
  }
  console.log("sqsEmail", sqsEmail);
  if (sqsEmail.length > 0) {
    return await Promise.all(sqsEmail);
  }
};

export const payloadUserPrime = (usersPrime, premiumCompanies) => {
  const dataUser = [];
  const dataPremiumArray = [];
  for (let element of usersPrime) {
    dataUser.push({
      id: element.id_user,
      benefit_end_date: premiumCompanies[0].end_date,
      card_brand: "PREMIUM",
      card_bin: "9999",
      role: "0",
    });
    dataPremiumArray.push({
      id: element.id_premium_user,
      user_id: element.id_user,
    });
  }
  return { dataUser, dataPremiumArray };
};

export const payloadUserPrimeUnsubscribe = (userPrimeUnsubscribe) => {
  return true;
};

export const payloadUserPrimeBlock = async (
  userPrimeBlock,
  premiumCompanies
) => {
  const results = [];

  for (let element of userPrimeBlock) {
    results.push(dataBody(element, premiumCompanies));
  }
  try {
    await Promise.all(results);
  } catch (e) {
    console.log(e);
  }
};

export const enableUser = async (user, premiumCompanies) => {
  const bffUrl = await getSecretBff("ar-ccom-prime-bff-secrets");
  console.log({ bffUrl });
  console.log({ premiumCompanies });
  try {
    return await axios.patch(
      `${bffUrl.url}/api/v1/user/${user.dni}/enable`,
      {
        is_premium: 1,
        benefit_value: premiumCompanies[0].end_date,
      },
      {
        headers: {
          apiKey: bffUrl.apikey,
          "x-header-location": "YXItYXI=",
        },
      }
    );
  } catch (e) {
    console.log("&&&&&");
    console.log(e);
    console.log("&&&&&");
  }
};

export const notPremiumExist = (
  usersNotInt,
  premiumCompanies,
  total = 5000,
  index = 0
) => {
  const purchaseToInsert = [];
  console.log("index", index);
  console.log("usersNotInt", usersNotInt);
  for (let i = index; i < total; i++) {
    purchaseToInsert.push({
      siebel_id: usersNotInt[i].idcliente,
      user_id: null,
      dni: usersNotInt[i].dni,
      promotion_company_id: premiumCompanies[0].id,
      first_name: usersNotInt[i].first_name,
      last_name: usersNotInt[i].last_name,
      email: usersNotInt[i].email.toLowerCase(),
      phone: usersNotInt[i].phone,
      gender: usersNotInt[i].gender,
      dni_type: usersNotInt[i].estado_civil,
      bday: moment(usersNotInt[i].bday, "DD/MM/YYYY").format("YYYY-MM-DD"),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  return purchaseToInsert;
};

const sumDate = (benefitEndDateUser, endDatePremiumCompanies) => {
  return new Date(
    new Date(benefitEndDateUser).getTime() +
      new Date(endDatePremiumCompanies).getTime()
  );
};

const dataBody = (optionalDataDto, email) => {
  return {
    mergeTriggerRecordData: {
      mergeTriggerRecords: [
        {
          fieldValues: [email],
          optionalData: optionalDataDto,
        },
      ],
      fieldNames: ["EMAIL_ADDRESS_"],
    },
    mergeRule: {
      htmlValue: "H",
      matchColumnName1: "EMAIL_ADDRESS_",
      matchColumnName2: null,
      insertOnNoMatch: true,
      defaultPermissionStatus: "OPTIN",
      rejectRecordIfChannelEmpty: "E",
      optinValue: "I",
      updateOnMatch: "REPLACE_ALL",
      textValue: "T",
      matchOperator: "NONE",
    },
  };
};
