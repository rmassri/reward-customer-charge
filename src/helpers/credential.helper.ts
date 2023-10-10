export const getCredential = () => {
  return {
    apikey:
      process.env.ENV == "prod"
        ? "974bdc0d947f7b24d3d6"
        : "5917436b664a9db50c47",
    endpoint_void:
      process.env.ENV == "prod"
        ? "https://ccom-connect-fiserv-prime.ecomm.cencosud.com/api/v1/payments/arg/void"
        : "https://ccom-connect-fiserv-prime.ecomm-stg.cencosud.com/api/v1/payments/arg/void",
    endpoint_transaction:
      process.env.ENV == "prod"
        ? "https://ccom-connect-fiserv-prime.ecomm.cencosud.com/api/v1/payments/arg/transaction/merchant"
        : "https://ccom-connect-fiserv-prime.ecomm-stg.cencosud.com/api/v1/payments/arg/transaction/merchant",
  };
};
