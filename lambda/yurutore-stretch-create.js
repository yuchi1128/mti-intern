const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2_stretchcontent";

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
  if (!body || !body.Symptom || !body.Severity || !body.ImageURLs || !body.Duration) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエストです。必要なフィールドが不足しています。",
    });
    return response;
  }

  const { Symptom, Severity, ImageURLs, Duration } = body;

  // DynamoDB に保存するためのパラメータ
  const param = {
    TableName,
    Item: marshall({
      Symptom: Symptom, // パーティションキー
      Severity: Severity, // ソートキー
      ImageURLs: ImageURLs,
      Duration: Duration
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
