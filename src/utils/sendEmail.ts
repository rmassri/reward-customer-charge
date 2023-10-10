import axios from "axios";
import * as FormData from "form-data";
const getToken = async () => {
  try {
    const url =
      "https://fni6s5-api.responsys.ocs.oraclecloud.com/rest/api/v1.3/auth/token";
    let formData = new FormData.default();
    formData.append("user_name", "APIPRIME@Fidelidad");
    formData.append("password", "Jumb0pr1m3c3nc0!");
    formData.append("auth_type", "password");
    return (
      await axios.post(url, formData, {
        headers: formData.getHeaders(),
      })
    ).data;
  } catch (e) {
    console.log("error getToken", e);
    throw e;
  }
};

const sendEmail = async (data, token, campaint) => {
  try {
    const url = `https://fni6s5-api.responsys.ocs.oraclecloud.com/rest/api/v1.3/campaigns/${campaint}/email`;
    return await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
  } catch (e) {
    console.log("----sendEmail------", e);
  }
};

export const principalFunctionSendEmail = async (data, campaint) => {
  try {
    const token = await getToken();
    const { authToken } = token;
    const email = await sendEmail(data, authToken, campaint);
    return email;
  } catch (error) {
    console.log("principalFunctionSendEmail", error);
    console.log("principalFunctionSendEmail", error.response);
    if (error.response && error.response.status === 401) {
      const token = await getToken();
      console.log("22......22");
      console.log(token);
      console.log("22......22");
      const { authToken } = token;
      const email = await sendEmail(data, authToken, campaint);
      return email;
    }
  }
};
