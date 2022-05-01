const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

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

        //TODO: add tests to validate returns of promise
        // only return value if rejected
        const checkPromise = await new Promise((resolve, reject) => {
            requireFields.forEach(f => {
                if (!keys.includes(f)) {
                    reject(`MUST PROVIDE PARAMETER ${f}`);
                }
            });
            resolve();
        }).catch(e => {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: e })
            };
        });

        // return if the promise was rejected
        if (checkPromise) return checkPromise;

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
                        realm: createParams.realm
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
