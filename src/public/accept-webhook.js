const AWS = require("aws-sdk");
const Stripe = require("stripe");
const dbHelpers = require("../../utils/db-helpers");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async event => {
    console.log("start" + JSON.stringify(event));
    try {
        let webhookEvent = event.body;
        // Get the signature sent by Stripe
        const signature = event.headers["Stripe-Signature"];

        // get stripe account details from db
        const stripeAccount = await dbHelpers.getDbItem(
            process.env.STRIPE_ACCOUNT_TABLE,
            dynamoDb,
            {
                partitionKey: "publishableKey",
                value: event.queryStringParameters.publishableKey
            }
        );

        const { realm, secretKey, webhookSecret } = JSON.parse(
            stripeAccount.body
        );
        const stripe = Stripe(secretKey);

        try {
            webhookEvent = stripe.webhooks.constructEvent(
                webhookEvent,
                signature,
                webhookSecret
            );
        } catch (err) {
            console.error(
                `Webhook signature verification failed.`,
                err.message
            );
            return {
                statusCode: 404,
                body: JSON.stringify(err)
            };
        }
        console.log(webhookEvent);
        const { type, data } = webhookEvent;
        console.log(`event type: ${type}`);
        console.log(`event data: ${data}`);
        return { statusCode: 200 };
    } catch (e) {
        console.error(`UNCAUGHT ERROR ${e}`);
        return {
            statusCode: 402,
            body: JSON.stringify(e)
        };
    }
};
