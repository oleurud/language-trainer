'use strict'

const redis = requireRoot('services/db/redis')

module.exports = {
    async cleanDb(){
        const redisClient = redis.getClient()
        await redisClient.flushdbAsync()

        const models = requireRoot('./appManager').models
        for (let modelName in models) {
            await models[modelName].destroy({ where: {}})
        }

        return
    },

    async getSuperAdminUser(email) {
        const User = requireRoot('./appManager').models.User
        let user = await User.findByEmail(email)
        user.role = 'SuperAdmin'
        user.save()
    }
}
