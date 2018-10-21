'use strict'

module.exports = function (query) {
    let limit = 25
    let page = 1

    const queryPage = parseInt(query.page)
    if (!isNaN(queryPage) && queryPage > 0) { page = queryPage }

    const queryLimit = parseInt(query.limit)
    if (!isNaN(queryLimit) && queryLimit > 0) { limit = queryLimit }

    return {
        offset: (page - 1) * limit,
        page,
        limit
    }
}
