const helpers = require("../../utils/helpers");

describe("Test Required Parameter Function", () => {
    test("Success: Validates required parameters and returns true", async () => {
        const res = await helpers.validateRequiredFields(
            ["test1", "test2"],
            ["test1", "test2"],
            "testFunc"
        );
        expect(res).toBe(true);
    });

    test("Fail: Validates required parameters and returns string", async () => {
        const res = await helpers.validateRequiredFields(
            ["test1", "test2"],
            ["test1"],
            "testFunc"
        );
        expect(res).toBe(`MUST PROVIDE PARAMETER test2 FOR METHOD testFunc`);
    });
});
