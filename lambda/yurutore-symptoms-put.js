const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

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

  // リクエストボディのパース
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.user_id || !body.SymptomId || !body.SymptomDetails || !body.ActionsTaken || !body.Note) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエストです。必須フィールドが不足しています。",
    });
    return response;
  }

  const { user_id, SymptomId, SymptomDetails, ActionsTaken, Note } = body;

  // DynamoDB に保存するためのパラメータ
  const param = {
    TableName,
    Key: marshall({
      user_id: user_id,  // リクエストから取得したユーザーIDを使用
      SymptomId: SymptomId,
    }),
    UpdateExpression: "SET SymptomDetails = :sd, ActionsTaken = :at, Note = :n",
    ExpressionAttributeValues: marshall({
      ":sd": SymptomDetails,
      ":at": ActionsTaken,
      ":n": Note || "",
    }),
    ReturnValues: "ALL_NEW",  // 更新後のアイテムを返す
  };

  const command = new UpdateItemCommand(param);
  try {
    const result = await client.send(command);
    response.body = JSON.stringify({
      message: "症状の記録が正常に更新されました。",
      updatedItem: unmarshall(result.Attributes),  // 更新されたアイテムを返す
    });
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "症状の更新に失敗しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};
