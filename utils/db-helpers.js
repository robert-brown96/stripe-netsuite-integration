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

/**
 *
 *
 * @param {String} tableName
 * @param {DocumentClient} db
 * @return {*}
 */
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

/**
 *
 *
 * @param {String} tableName
 * @param {DocumentClient} db
 * @param {Object} keyValue
 * @param {Object} updateValues
 */
const updateDbItem = async (tableName, db, keyValue, data) => {
    try {
        const updateKeys = Object.keys(data);
        let setVals = updateKeys.reduce((result, k) => {
            console.log(`checking key ${k}`);
            if (data[k] && data[k] !== "" && data[k] !== "null")
                result.push(`${k} = :${k}`);
            return result;
        }, []);
        console.log(`sets ${JSON.stringify(setVals)}`);
        let attributeValues = {};
        setVals.forEach(element => {
            attributeValues[`:${element}`] = data[element];
        });
        console.log(`attribute vals ${JSON.stringify(attributeValues)}`);

        const updateParams = {
            TableName: tableName,
            Key: keyValue,
            UpdateExpression: `SET ${setVals.join(",")}`,
            ExpressionAttributeValues: attributeValues,
            ReturnValues: "ALL_NEW"
        };

        return await db
            .update(updateParams)
            .promise()
            .then(res => {
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(res)
                };
            })
            .catch(e => {
                return {
                    statusCode: 404,
                    headers: { "Content-Type": "application/json" },
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

module.exports = { getDbItem, scanTable, updateDbItem };
