const AWS = require("aws-sdk");

const helpers = require("../../../utils/helpers");
const dynamoDb = new AWS.DynamoDB.DocumentClient(
    process.env.IS_OFFLINE
        ? { region: "localhost", endpoint: "http://localhost:8000" }
        : {}
);

module.exports.handler = async event => {
    console.log(JSON.stringify(event));

    try {
        const data = event.body;
        const keys = Object.keys(data);
        const requireFields = [
            "realm",
            "consumerKey",
            "consumerSecret",
            "tokenId",
            "tokenSecret",
            "url"
        ];

        const checkParams = await helpers.validateRequiredFields(
            requireFields,
            keys,
            "createNetSuiteAccount"
        );

        if (typeof checkParams === "string")
            return {
                statusCode: 404,
                body: JSON.stringify({ error: checkParams })
            };

        const createParams = {
            TableName: process.env.NS_ACCOUNT_TABLE,
            Item: {
                realm: data.realm,
                consumerKey: data.consumerKey,
                consumerSecret: data.consumerSecret,
                tokenId: data.tokenId,
                tokenSecret: data.tokenSecret,
                url: data.url
            }
        };
        // TODO: Not rejecting dups
        return dynamoDb
            .put(createParams)
            .promise()
            .then(res => {
                console.log(`success ${JSON.stringify(res)}`);
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        success: true,
                        realm: createParams.Item.realm
                    })
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
