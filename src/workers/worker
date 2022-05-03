module.exports.handler = async event => {
    console.log("start" + JSON.stringify(event));
    try {
        return { statusCode: 200 };
    } catch (e) {
        console.error(`UNCAUGHT ERROR ${e}`);
        return {
            statusCode: 402,
            body: JSON.stringify(e)
        };
    }
};
