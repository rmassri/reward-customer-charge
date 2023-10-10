import AWS from "aws-sdk";
import { User } from "../entities/user.entity";

type optionalData = { name: string; value: string | number };

export const sqsRequestEmail = async (
  user: User,
  campaing_name: string,
  optionalData?: optionalData[]
): Promise<any> => {
  AWS.config.update({
    region: "us-east-1",
    accessKeyId: "ASIARQE7RXFFI67CKKTB",
    secretAccessKey: "B5mOdPbO4aIB/tLB/Sd3HiIfOrlFZogdmCxKE65P",
    sessionToken:
      "IQoJb3JpZ2luX2VjECsaCXVzLWVhc3QtMSJIMEYCIQDIqzkFGi8gDrYorFGnjIAxgLCjglvsTlGYTH8LnuO4OAIhANxooTfA0gOrDX2/HcRYfipq387cOjw9GX6XHSuM5PfQKp8DCDQQBBoMMTAzNDEzODIzODE4IgxdgJtoHUTXuS3t2SMq/ALFT2J6UpO+ULKD+R86eLVhwr09N0dM4/j/0uGOP7gs5U0FugMr60jTwzy4UzIEYcU/S3salD+NGE7A9tkduiFiFh6LK08q12GeJcBCV9X2nwembxdhzRdIJKVEEz9MTQK5pushxc58zxz7H7k1Vshs7FY6VGKnjGEfmzKm25KXo49H1VowDr14z0+Eg3iCCdF14cuC39hIdCtbFgfCwd4GQK4VI6oCkvYrCraF+YW/G3xEfGtlbeilfISewLava0xTEoX8m9UHuKCPB1rugLGwFDeQbClguUQciizU+YmzIWK/zypioUNRGBiUb1jIUhOhb/lyaYu0Pfd/r9pRInrCLC1P4SZPlr0Yp3dJGO7OuGPW1pz07bj6lXv1JKENjftxqC+OGpgWaJ0lbKuojygMR/DNOzKUCJQINomNii1OjrRm1kUFezOcF0MPPoYfUr013/VOmlCX9PTAEsUz9YIJXAwLPQIfKb2ROUE1tUB+8BNnNdnMfCjhOnd7cTDovvGoBjqlAavYXQXy5vOnoZETh/w6uxAHgsedC0s/2QAgGlhHZ0wFMnV7ObRRWG2EBezPT0H2GeWXzVoGRjcXYeXGYfWpgd79B6UpFstujNIbo0cITkiRevQro5G7HI+VX4Yn3uMCuuVZOjsrCK6dtfM8rLk2vsr407tazMKflNcGdqQcPFqMyjY2t3tY0bKQiGsdsePdPVC9Hqs9usjKwmOGeVTXIbYi3raRnA==",
  });

  const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

  let params = {
    MessageBody: JSON.stringify({
      campaing_name,
      mergeTriggerRecords: [
        {
          fieldValues: [user.email],
        },
      ],
    }),
    QueueUrl: `https://sqs.us-east-1.amazonaws.com/103413823818/reg-ccom-loyalty-ar-prime-sqs-responsys-emails`,
  };

  if (optionalData) {
    params = {
      MessageBody: JSON.stringify({
        campaing_name,
        mergeTriggerRecords: [
          {
            fieldValues: [user.email],
            optionalData,
          },
        ],
      }),
      QueueUrl: `https://sqs.us-east-1.amazonaws.com/103413823818/reg-ccom-loyalty-ar-prime-sqs-responsys-emails`,
    };
  }
  //console.log("optionalData", optionalData);
  //console.log("sqsRequestEmailParams", params);

  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (error: any, data: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(data.MessageId);
      }
    });
  });
};
