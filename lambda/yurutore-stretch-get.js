
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

  // クエリパラメータの取得
  const { Stretch_id, Severity } = event.queryStringParameters || {};

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
      ":stretch_id": { S: Stretch_id },  // Stretch_idを文字列として渡す
      ":severity": { N: Severity }       // Severityを数値として渡す
    }
  };

  try {
    const data = await client.send(new QueryCommand(params));
    if (data.Items.length === 0) {
      response.body = JSON.stringify({
        message: "指定されたStretch_idとSeverityに該当するデータが見つかりません。",
      });
    } else {
      const items = data.Items.map(item => ({
        symptom: item.Symptom ? item.Symptom.S : null, // Symptomが存在する場合は文字列として取得
        imageUrl: item.ImageURLs ? item.ImageURLs.S : null, // ImageURLsが存在する場合は文字列として取得
        duration: item.Duration ? parseInt(item.Duration.N, 10) : null, // Durationが存在する場合は数値に変換
        stretchContext: item.Stretch_context ? item.Stretch_context.SS : [] // Stretch_contextが存在する場合は配列として取得
      }));

      response.body = JSON.stringify({
        items, // 取得したデータをそのまま返す
      });
    }
  } catch (error) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "ストレッチ内容の取得に失敗しました。",
      errorDetail: error.toString(),
    });
  }

  return response;
};
