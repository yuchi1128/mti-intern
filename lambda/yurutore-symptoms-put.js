const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2_user_symptoms";

// メインハンドラ関数
exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "症状の更新が成功しました。",
    }),
  };

  try {
    // リクエストボディのパース
    const body = event.body ? JSON.parse(event.body) : null;
    if (!body || !body.user_id || !body.SymptomId || !body.SymptomDetails || !body.ActionsTaken || !body.Note) {
      response.statusCode = 400;
      response.body = JSON.stringify({
        message: "無効なリクエストです。必須フィールドが不足しています。",
      });
      return response;
    }

    const { user_id, SymptomId, SymptomDetails, ActionsTaken = [], Note = "" } = body;
    const Timestamp = new Date().toISOString();

    // DynamoDBに保存するためのパラメータ
    const param = {
      TableName,
      Key: marshall({
        user_id: user_id,  // リクエストから取得したユーザーIDを使用
        SymptomId: SymptomId,
      }),
      UpdateExpression: "SET #sd = :sd, #at = :at, #n = :n, #ts = :ts",
      ExpressionAttributeNames: {
        "#sd": "SymptomDetails",
        "#at": "ActionsTaken",
        "#n": "Note",
        "#ts": "Timestamp",
      },
      ExpressionAttributeValues: marshall({
        ":sd": SymptomDetails,
        ":at": ActionsTaken,
        ":n": Note || "",
        ":ts": Timestamp,
      }),
      ReturnValues: "ALL_NEW",  // 更新後のアイテムを返す
    };

    // DynamoDBにアイテムを更新
    const command = new UpdateItemCommand(param);
    const result = await client.send(command);

    // 成功レスポンスの作成
    response.body = JSON.stringify({
      message: "症状の更新が成功しました。",
      updatedItem: unmarshall(result.Attributes),  // 更新後のアイテムを返す
    });

  } catch (error) {
    // エラーハンドリング
    console.error("エラーが発生しました: ", error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "エラーが発生しました。",
      error: error.message,
    });
  }

  return response;
};
