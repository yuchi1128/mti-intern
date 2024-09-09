// const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
// const { marshall } = require("@aws-sdk/util-dynamodb");

// const client = new DynamoDBClient({ region: "ap-northeast-1" });
// const TableName = "team2_Stratchcontent";

// const VALID_TOKEN = "mtiToken";

// exports.handler = async (event) => {
//   const response = {
//     statusCode: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//     },
//     body: JSON.stringify({ message: "" }),
//   };

//   // ヘッダーからトークンを取得
//   const authHeader = event.headers.Authorization || event.headers.authorization;
//   if (!authHeader || authHeader !== `Bearer ${VALID_TOKEN}`) {
//     response.statusCode = 401;
//     response.body = JSON.stringify({
//       message: "認証トークンが無効です。",
//     });
//     return response;
//   }

//   // リクエストボディのパース
//   const body = event.body ? JSON.parse(event.body) : null;

//   // デバッグ用ログ
//   console.log("Request body:", body);
  
//   if (!body || !body.Stretch_id || typeof body.Symptom !== 'string' || typeof body.Severity !== 'number' || typeof body.ImageURLs !== 'string' || typeof body.Duration !== 'number' || !Array.isArray(body.Stretch_context)) {
//     response.body = JSON.stringify({
//       message: "無効なリクエストです。必要なフィールドが不足しています。",
//     });
//     return response;
//   }

//   const { Stretch_id, Symptom, Severity, ImageURLs, Duration, Stretch_context } = body;

//   // DynamoDB に保存するためのパラメータ
//   const param = {
//     TableName,
//     // Item: marshall({
//     //   Stretch_id: Stretch_id,
//     //   Symptom: Symptom,         // 数値として保存
//     //   Severity: Severity,       // 数値として保存
//     //   ImageURLs: ImageURLs,    // 文字列として保存
//     //   Duration: Duration,      // 数値として保存
//     //   Stretch_context: Stretch_context // 配列として保存
//     // }),
//     Item: marshall({
//       Stretch_id: Stretch_id,
//       Symptom: Symptom,
//       Severity: Severity,  // 文字列として保存
//       ImageURLs: ImageURLs,
//       Duration: Duration,
//       Stretch_context: Stretch_context
//     }),
//   };

//   const command = new PutItemCommand(param);
//   try {
//     await client.send(command);
//     response.body = JSON.stringify({ message: "ストレッチ内容が正常に保存されました。" });
//   } catch (e) {
//     response.statusCode = 500;
//     response.body = JSON.stringify({
//       message: "ストレッチ内容の保存に失敗しました。",
//       errorDetail: e.toString(),
//     });
//   }

//   return response;
// };


const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2_Stratchcontent";

const VALID_TOKEN = "mtiToken";

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  // ヘッダーからトークンを取得
  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${VALID_TOKEN}`) {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: "認証トークンが無効です。",
    });
    return response;
  }

  // リクエストボディのパース
  const body = event.body ? JSON.parse(event.body) : null;

  // デバッグ用ログ
  console.log("Request body:", body);
  
  if (!body || !body.Stretch_id || typeof body.Symptom !== 'string' || typeof body.Severity !== 'number' || typeof body.ImageURLs !== 'string' || typeof body.Duration !== 'number' || !Array.isArray(body.Stretch_context) || typeof body.title !== 'string') {
    response.body = JSON.stringify({
      message: "無効なリクエストです。必要なフィールドが不足しています。",
    });
    return response;
  }

  const { Stretch_id, Symptom, Severity, ImageURLs, Duration, Stretch_context, title } = body;

  // DynamoDB に保存するためのパラメータ
  const param = {
    TableName,
    Item: marshall({
      Stretch_id: Stretch_id,
      Symptom: Symptom,
      Severity: Severity,  // 数値として保存
      ImageURLs: ImageURLs,
      Duration: Duration,
      Stretch_context: Stretch_context,
      title: title         // 文字列として保存
    }),
  };

  const command = new PutItemCommand(param);
  try {
    await client.send(command);
    response.body = JSON.stringify({ message: "ストレッチ内容が正常に保存されました。" });
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "ストレッチ内容の保存に失敗しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};
