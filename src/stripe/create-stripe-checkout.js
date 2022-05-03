const AWS = require("aws-sdk");

const dbHelpers = require("../../utils/db-helpers");
const stripeFunctions = require("../../utils/stripe-functions/create-checkout");
const dynamoDb = new AWS.DynamoDB.DocumentClient(
    process.env.IS_OFFLINE
        ? { region: "localhost", endpoint: "http://localhost:8000" }
        : {}
);

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
        const { secretKey, realm } = JSON.parse(stripeAccount.body);

        const checkoutRes = await stripeFunctions.createCheckout({
            secretKey: secretKey,
            itemDetails: {}
        });
        console.log(checkoutRes);
        return {
            statusCode: 302,
            headers: {
                Location: checkoutRes.url
            }
        };
    } catch (e) {
        console.error(`UNCAUGHT ERROR ${e}`);
        return {
            statusCode: 402,
            body: JSON.stringify(e)
        };
    }
};
