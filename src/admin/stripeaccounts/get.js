const AWS = require("aws-sdk");

const dbHelpers = require("../../../utils/db-helpers");
const dynamoDb = new AWS.DynamoDB.DocumentClient(
    process.env.IS_OFFLINE
        ? { region: "localhost", endpoint: "http://localhost:8000" }
        : {}
);

module.exports.handler = async event => {
    console.log(JSON.stringify(event));

    try {
        return await dbHelpers.getDbItem(
            process.env.STRIPE_ACCOUNT_TABLE,
            dynamoDb,
            {
                partitionKey: "publishableKey",
                value: event.pathParameters.publishableKey
            }
        );
    } catch (e) {
        console.error(`UNCAUGHT ERROR ${e}`);
        return {
            statusCode: 402,
            body: JSON.stringify(e)
        };
    }
};
