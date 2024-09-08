const { DynamoDBClient, GetItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const crypto = require('crypto');

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
  if (!body || !body.user_id || !body.SymptomDetails) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエストです。必須フィールドが不足しています。",
    });
    return response;
  }

  const { user_id, SymptomId = null, SymptomDetails, ActionsTaken = [], Note = "" } = body;
  const Timestamp = new Date().toISOString();

  // SymptomId がリクエストに無ければ新規作成
  const newSymptomId = SymptomId || crypto.randomBytes(16).toString("hex");

  // DynamoDB に保存するためのパラメータ（SymptomIdが無ければ新規作成）
  try {
    if (SymptomId) {
      // 既存のSymptomIdが指定されている場合は、そのデータを取得して更新
      const getItemParams = {
        TableName,
        Key: marshall({
          user_id: user_id,
          SymptomId: SymptomId,
        }),
      };

      const getItemCommand = new GetItemCommand(getItemParams);
      const data = await client.send(getItemCommand);

      if (data.Item) {
        // 既存データがある場合は、追記して更新
        const existingItem = unmarshall(data.Item);
        existingItem.SymptomDetails.push(...SymptomDetails);
        existingItem.ActionsTaken.push(...ActionsTaken);
        existingItem.Note += ` ${Note}`;
        existingItem.Timestamp = Timestamp;  // 最新のタイムスタンプに更新

        const updateItemParams = {
          TableName,
          Item: marshall(existingItem),
        };

        const updateCommand = new PutItemCommand(updateItemParams);
        await client.send(updateCommand);
        response.body = JSON.stringify({ message: "症状の記録が正常に更新されました。" });
      } else {
        // SymptomIdが指定されているが、データが存在しない場合（新規作成扱い）
        throw new Error("指定されたSymptomIdが見つかりません。");
      }
    } else {
      // SymptomId が指定されていない場合は新規作成
      const param = {
        TableName,
        Item: marshall({
          user_id: user_id,
          SymptomId: newSymptomId,
          SymptomDetails: SymptomDetails,
          ActionsTaken: ActionsTaken,
          Note: Note,
          Timestamp: Timestamp,
        }),
      };

      const command = new PutItemCommand(param);
      await client.send(command);
      response.body = JSON.stringify({ message: "症状の記録が正常に保存されました。" });
    }
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "症状の保存に失敗しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};
