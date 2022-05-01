const AWS = require("aws-sdk");

const helpers = require("../../../utils/helpers");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async event => {
    console.log(JSON.stringify(event));

    try {
        const getParams = {
            TableName: process.env.NS_ACCOUNT_TABLE,
            // GET rows where parameters match
            Key: {
                realm: event.pathParameters.realm
            }
        };

        return dynamoDb
            .get(getParams)
            .promise()
            .then(res => {
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(res.Item)
                };
            })
            .catch(e => {
                console.log(`error ${JSON.stringify(e)}`);
                console.error(JSON.stringify(e));
                return {
                    statusCode: 402,
                    body: JSON.stringify(e)
                };
            });
    } catch (e) {
        console.error(`UNCAUGHT ERROR ${e}`);
        return {
            statusCode: 402,
            body: JSON.stringify(e)
        };
    }
};
