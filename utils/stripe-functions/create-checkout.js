const stripe = require("stripe");

module.exports = createCheckout = async options => {
    try {
        const { secretKey, itemDetails } = options;

        const stripeCheckoutObj = await stripe.checkout.sessions.create(
            {
                success_url: "https://google.com",
                cancel_url: "https://yahoo.com",
                line_items: [
                ],
                mode: "payment"
            },
            {
                apiKey: secretKey
            }
        );
    } catch (e) {
        console.error(`ERROR IN CREATE CHECKOUT: ${e}`);
        throw e;
    }
};
