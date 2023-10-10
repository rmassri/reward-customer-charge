import axios from "axios";
import { getCredential } from "../helpers/credential.helper";

export const annulment = async (data, transactionId) => {
  const payload = {
    transactionId: transactionId,
    store: data.store,
    merchantTransactionId: data.merchant_transaction_id,
  };
  console.log("=====");
  console.log(payload);
  console.log("====");
  return await axios.post(getCredential().endpoint_void, payload, {
    headers: {
      "Content-Type": "application/json",
      apikey: getCredential().apikey,
    },
  });
};

export const getTransaction = async (data) => {
  const payload = {
    merchant_transaction_id: data.merchant_transaction_id,
    store: data.store,
  };
  return axios.post(getCredential().endpoint_transaction, payload, {
    headers: {
      "Content-Type": "application/json",
      apikey: getCredential().apikey,
    },
  });
};
