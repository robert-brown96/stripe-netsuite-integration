const { getDbItem } = require("../../utils/db-helpers");

const aws = require("aws-sdk");

jest.mock("aws-sdk", () => {
    const mDocumentClient = { get: jest.fn() };
    const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };
    return { DynamoDB: mDynamoDB };
});
const mDynamoDb = new aws.DynamoDB.DocumentClient();

describe("Test Database Funcitons", () => {
    afterAll(() => {
        jest.resetAllMocks();
    });
    test("should get from table", async () => {
        const mResult = { realm: "tstdrv" };
        mDynamoDb.get.mockImplementationOnce(_ => mResult);
        const actual = await getDbItem(
            process.env.NETSUITE_ACCOUNT_TABLE,
            mDynamoDb,
            { partitionKey: "realm", value: "tstdrv" }
        );
    });
});
