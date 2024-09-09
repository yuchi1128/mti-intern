
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2_Stratchcontent";

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  // デバッグ用にeventをログに出力する
  console.log("Event:", JSON.stringify(event, null, 2));

  // クエリパラメータの取得
  const { Stretch_id, Severity } = event.queryStringParameters || {};

  console.log("Stretch_id:", Stretch_id);
  console.log("Severity:", Severity);

  if (!Stretch_id || !Severity) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエストです。Stretch_idとSeverityを指定してください。",
    });
    return response;
  }

  // DynamoDBクエリ用のパラメータ
  const params = {
    TableName,
    KeyConditionExpression: "Stretch_id = :stretch_id AND Severity = :severity",
    ExpressionAttributeValues: {
      ":stretch_id": { S: Stretch_id },
      ":severity": { N: Severity.toString() } // Severityは数値で、文字列に変換する必要があります
    },
    ProjectionExpression: "#symptom, #imageUrl, #duration, #stretchContext, #title",
    ExpressionAttributeNames: {
      "#symptom": "Symptom",
      "#imageUrl": "ImageURLs",
      "#duration": "Duration",
      "#stretchContext": "Stretch_context",
      "#title": "title"
    }
  };

  try {
    const data = await client.send(new QueryCommand(params));
    console.log("DynamoDB Response Data:", JSON.stringify(data, null, 2)); // DynamoDBのレスポンスデータをログに出力

    if (data.Items.length === 0) {
      response.body = JSON.stringify({
        message: "指定されたStretch_idに該当するデータが見つかりません。",
      });
    } else {
      const items = data.Items.map(item => ({
        symptom: item.Symptom ? item.Symptom.S : null,
        imageUrl: item.ImageURLs ? item.ImageURLs.S : null,
        duration: item.Duration ? parseInt(item.Duration.N, 10) : null,
        stretchContext: item.Stretch_context ? item.Stretch_context.L.map(c => c.S) : [], // Stretch_contextを文字列の配列に変換
        title: item.title ? item.title.S : null // title を追加
      }));

      response.body = JSON.stringify({
        items,
      });
    }
  } catch (error) {
    console.error("Error:", error); // エラーの詳細をログに出力
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "ストレッチ内容の取得に失敗しました。",
      errorDetail: error.toString(),
    });
  }

  return response;
};
