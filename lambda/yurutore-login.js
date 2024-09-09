const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall, marshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2_user";

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.user_id || !body.password) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエストです。request bodyに必須パラメータがセットされていません。",
    });

    return response;
  }

  const { user_id, password } = body;

  const param = {
    TableName,
    KeyConditionExpression: "user_id = :uid",
    ExpressionAttributeValues: marshall({
      ":uid": user_id,
    }),
  };

  const command = new QueryCommand(param);
  try {
    const { Items } = await client.send(command);

    if (Items.length === 0) {
      throw new Error("ユーザーIDが見つかりません");
    }

    const user = unmarshall(Items[0]);
    if (user.password !== password) {
      throw new Error("パスワードが一致しません");
    }

    response.body = JSON.stringify({ token: "mtiToken" });
  } catch (e) {
    if (e.message === "ユーザーIDが見つかりません" || e.message === "パスワードが一致しません") {
      response.statusCode = 401;
      response.body = JSON.stringify({ message: e.message });
    } else {
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "予期せぬエラーが発生しました。",
        errorDetail: e.toString(),
      });
    }
  }

  return response;
};
