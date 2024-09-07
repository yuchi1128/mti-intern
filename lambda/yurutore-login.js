const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const crypto = require('crypto');  // cryptoモジュールを追加

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2_user";

// パスワードのハッシュ化関数
const hashPassword = (password) => {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex'); // ハッシュ値を16進数文字列として返す
};

exports.handler = async (event, context) => {
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

  // パスワードをハッシュ化
  const hashedPassword = hashPassword(password);

  const param = {
    TableName,
    KeyConditionExpression: "user_id = :uid",
    FilterExpression: "password = :pkey",
    ExpressionAttributeValues: marshall({
      ":uid": user_id,
      ":pkey": hashedPassword,
    }),
  };

  const command = new QueryCommand(param);
  try {
    const { Count } = await client.send(command);
    if (Count === 0) {
      throw new Error("userIdまたはpasswordが一致しません");
    }
    response.body = JSON.stringify({ token: "mtiToken" });
  } catch (e) {
    if (e.message === "userIdまたはpasswordが一致しません") {
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