const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2_user";

exports.handler = async (event, context) => {
  //レスポンスの雛形
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const user_id = event.queryStringParameters?.user_id; //見たいユーザのuser_id
  if (!user_id) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        "無効なリクエストです。クエリストリングに必須パラメータがセットされていません。",
    });

    return response;
  }
  
 // 取得対象のテーブル名と検索に使うキーをparamに宣言
  const param = {
    TableName,
    Key: marshall({
      user_id,
    }),
  };

  const command = new GetItemCommand(param);

  //GetItemCommandの実行でDBからデータを取得
  try {
    const user = (await client.send(command)).Item;
    delete user?.password;

    response.body = JSON.stringify(unmarshall(user));
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};
