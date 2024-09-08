const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

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

  if (!user_id || !SymptomId) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエストです。user_id と SymptomId が指定されていません。",
    });
    return response;
  }

  // DynamoDB からアイテムを削除するためのパラメータ
  const param = {
    TableName,
    Key: {
      user_id: { S: user_id },
      SymptomId: { S: SymptomId },
    },
  };

  const command = new DeleteItemCommand(param);
  try {
    await client.send(command);
    response.body = JSON.stringify({ message: "症状の記録が正常に削除されました。" });
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "症状の削除に失敗しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};
