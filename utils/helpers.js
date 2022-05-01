/**
 *
 *
 * @param {String[]} requiredFields
 * @param {String[]} providedFields
 * @param {String} method
 * @return {Boolean|String}
 */
const validateRequiredFields = async (
    requiredFields,
    providedFields,
    method
) => {
    try {
        const res = await new Promise((resolve, reject) => {
            requiredFields.forEach(f => {
                if (!providedFields.includes(f)) {
                    resolve(`MUST PROVIDE PARAMETER ${f} FOR METHOD ${method}`);
                }
            });
            resolve(true);
        });
        return res;
    } catch (e) {
        console.error(`ERROR VALIDATING FIELDS ${e}`);
    }
};

module.exports = { validateRequiredFields };
