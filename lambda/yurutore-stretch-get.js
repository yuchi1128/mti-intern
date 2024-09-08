const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team2_stretchcontent";

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  // クエリパラメータの取得
  const { Symptom, Severity } = event.queryStringParameters || {};

  if (!Symptom || !Severity) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエストです。症状と深刻度を指定してください。",
    });
    return response;
  }

  // DynamoDBクエリ用のパラメータ
  const params = {
    TableName,
    KeyConditionExpression: "Symptom = :symptom AND Severity = :severity",
    ExpressionAttributeValues: {
      ":symptom": { S: Symptom },  // Symptomを文字列として渡す
      ":severity": { S: Severity } // Severityも文字列として渡す
    }
  };

  try {
    const data = await client.send(new QueryCommand(params));
    if (data.Items.length === 0) {
      response.body = JSON.stringify({
        message: "指定された症状と深刻度に該当するストレッチ画像が見つかりません。",
      });
    } else {
      const items = data.Items.map(item => ({
        imageUrl: item.ImageURLs.S,
        duration: item.Duration ? parseInt(item.Duration.N, 10) : null // Durationが存在する場合は数値に変換
      }));

      response.body = JSON.stringify({
        images: items,
      });
    }
  } catch (error) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "ストレッチ画像の取得に失敗しました。",
      errorDetail: error.toString(),
    });
  }

  return response;
};
