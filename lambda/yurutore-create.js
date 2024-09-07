const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const crypto = require('crypto'); // cryptoモジュールをインポート
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

  // リクエストボディの中身をJavaScriptオブジェクトに変換
  const { user_id, password } = JSON.parse(event.body);

  try {
    // パスワードのハッシュ化
    const hashedPassword = hashPassword(password);

    // DBに登録するための情報をparamオブジェクトとして宣言
    const param = {
      TableName,
      Item: marshall({
        user_id,
        password: hashedPassword, // ハッシュ化されたパスワードを保存
      }, {
        removeUndefinedValues: true,  // undefined の値を除去
      }),
    };

    // DBにデータを登録するコマンドを用意
    const command = new PutItemCommand(param);

    // client.send()でDBにデータを登録するコマンドを実行
    await client.send(command);

    // 登録に成功した場合の処理
    response.statusCode = 201;
    response.body = JSON.stringify({ user_id});
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};
