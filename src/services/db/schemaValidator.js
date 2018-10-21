var revalidator = require('revalidator')

module.exports = function schemaValidator (schema) {
    return function (value) {
        var results = revalidator.validate(value, schema)
        if (!results.valid) throw new Error(JSON.stringify(results.errors))
    }
}
