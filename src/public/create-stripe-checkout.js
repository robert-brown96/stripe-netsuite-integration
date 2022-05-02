const AWS = require("aws-sdk");

const dbHelpers = require("../../../utils/db-helpers");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async event => {
    console.log(JSON.stringify(event));
    try {
        // get stripe account details from db
        const stripeAccount = await dbHelpers.getDbItem(
            process.env.STRIPE_ACCOUNT_TABLE,
            dynamoDb,
            {
                partitionKey: "publishableKey",
                value: event.queryStringParameters.publishableKey
            }
        );
        console.log(stripeAccount);

        // extract netsuite account realm and the secret key
        const { secretKey, realm } = stripeAccount.body;
    } catch (e) {
        console.error(`UNCAUGHT ERROR ${e}`);
        return {
            statusCode: 402,
            body: JSON.stringify(e)
        };
    }
};
