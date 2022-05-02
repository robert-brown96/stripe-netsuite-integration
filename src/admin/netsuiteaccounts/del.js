const AWS = require("aws-sdk");

const dbHelpers = require("../../../utils/db-helpers");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async event => {
    console.log(JSON.stringify(event));

    try {
        return await dbHelpers.delDbItem(
            process.env.NS_ACCOUNT_TABLE,
            dynamoDb,
            { partitionKey: "realm", value: event.pathParameters.realm }
        );
    } catch (e) {
        console.error(`UNCAUGHT ERROR ${e}`);
        return {
            statusCode: 402,
            body: JSON.stringify(e)
        };
    }
};
