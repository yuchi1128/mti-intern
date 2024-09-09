// const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
// const { unmarshall } = require("@aws-sdk/util-dynamodb");

// const client = new DynamoDBClient({ region: "ap-northeast-1" });
// const TableName = "team2_user_symptoms";

// // 固定の認証トークン
// const VALID_TOKEN = "mtiToken";

// exports.handler = async (event, context) => {
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

//   // クエリパラメータから user_id と SymptomId を取得
//   const user_id = event.queryStringParameters?.user_id;
//   const SymptomId = event.queryStringParameters?.SymptomId;

//   if (!user_id || !SymptomId) {
//     response.statusCode = 400;
//     response.body = JSON.stringify({
//       message: "無効なリクエストです。user_id と SymptomId が指定されていません。",
//     });
//     return response;
//   }

//   // DynamoDB からデータを取得するためのパラメータ
//   const param = {
//     TableName,
//     Key: {
//       user_id: { S: user_id },
//       SymptomId: { S: SymptomId },
//     },
//   };

//   const command = new GetItemCommand(param);
//   try {
//     const data = await client.send(command);

//     if (data.Item) {
//       const item = unmarshall(data.Item);

//       response.body = JSON.stringify({
//         message: "データが正常に取得されました。",
//         data: {
//           SymptomDetails: item.SymptomDetails || null,
//           ActionsTaken: item.ActionsTaken || null,
//           Note: item.Note || null,
//           Timestamp: item.Timestamp || null,
//         },
//       });
//     } else {
//       response.statusCode = 404;
//       response.body = JSON.stringify({
//         message: "指定されたデータは存在しません。",
//       });
//     }
//   } catch (e) {
//     response.statusCode = 500;
//     response.body = JSON.stringify({
//       message: "データの取得に失敗しました。",
//       errorDetail: e.toString(),
//     });
//   }

//   return response;
// };



const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2_user_symptoms";

// 固定の認証トークン
const VALID_TOKEN = "mtiToken";

exports.handler = async (event, context) => {
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

  // クエリパラメータから user_id と SymptomId を取得
  const user_id = event.queryStringParameters?.user_id;
  const SymptomId = event.queryStringParameters?.SymptomId;

  if (!user_id) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエストです。user_id が指定されていません。",
    });
    return response;
  }

  try {
    let data;
    if (SymptomId) {
      // SymptomId が指定されている場合、1つのアイテムを取得
      const param = {
        TableName,
        Key: {
          user_id: { S: user_id },
          SymptomId: { S: SymptomId },
        },
      };
      data = await client.send(new GetItemCommand(param));

      if (data.Item) {
        const item = unmarshall(data.Item);
        response.body = JSON.stringify({
          message: "データが正常に取得されました。",
          data: item,
        });
      } else {
        response.statusCode = 404;
        response.body = JSON.stringify({
          message: "指定されたデータは存在しません。",
        });
      }
    } else {
      // SymptomId が指定されていない場合、user_id に関連するすべてのアイテムを取得
      const param = {
        TableName,
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
          ":user_id": { S: user_id },
        },
      };
      data = await client.send(new QueryCommand(param));

      if (data.Items.length > 0) {
        const items = data.Items.map(item => unmarshall(item));
        response.body = JSON.stringify({
          message: "データが正常に取得されました。",
          data: items,
        });
      } else {
        response.statusCode = 404;
        response.body = JSON.stringify({
          message: "指定されたデータは存在しません。",
        });
      }
    }
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "データの取得に失敗しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};
