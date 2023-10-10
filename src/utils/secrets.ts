export const getSecretBff = async (secret: string) => {
  if (process.env.NODE_ENV === "local") {
    return {
      url: process.env.BFF_URL,
      apikey: process.env.BFF_APIKEY,
    };
  }
};
