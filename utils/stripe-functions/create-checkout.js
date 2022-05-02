const Stripe = require("stripe");

const createCheckout = async options => {
    try {
        const { secretKey, itemDetails } = options;
        const stripe = Stripe(secretKey);

        const stripeCheckoutObj = await stripe.checkout.sessions.create({
            success_url: "https://google.com",
            cancel_url: "https://yahoo.com",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: `stripe checkout` },
                        unit_amount: 1000
                    }
                }
            ],
            mode: "payment"
        });

        return stripeCheckoutObj;
    } catch (e) {
        console.error(`ERROR IN CREATE CHECKOUT: ${e}`);
        throw e;
    }
};

module.exports = { createCheckout };
