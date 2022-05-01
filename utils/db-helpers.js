const { DocumentClient } = require("aws-sdk/clients/dynamodb");

/**
 *
 *
 * @param {String} tableName
 * @param {DocumentClient} db
 * @param {Object} { partitionKey, value }
 * @return {*}
 */
const getDbItem = async (tableName, db, { partitionKey, value }) => {
    try {
        let keyObj = {};
        keyObj[partitionKey] = value;
        const getParams = {
            TableName: tableName,
            // GET rows where parameters match
            Key: keyObj
        };
        return db
            .get(getParams)
            .promise()
            .then(res => {
                return res.Item
                    ? {
                          statusCode: 200,
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(res.Item)
                      }
                    : {
                          statusCode: 401,
                          body: { error: "NO RESULTS FOUND" }
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

const scanTable = async (tableName, db) => {
    try {
        const listParams = {
            TableName: tableName
        };
        const results = await db.scan(listParams).promise();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(results.Items)
        };
    } catch (e) {
        console.error(`UNCAUGHT ERROR ${e}`);
        return {
            statusCode: 402,
            body: JSON.stringify(e)
        };
    }
};

module.exports = { getDbItem, scanTable };
