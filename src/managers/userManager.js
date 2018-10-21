'use strict'

const exception = require('../services/customExceptions')

module.exports = {

    async getProfile (user) {
        return user.getPublicInfo()
    },

    async setProfile (user, data) {
        const name = data.name
        const lastname = data.lastname
        const image = data.image

        let profile = user.profile || {}

        if (name) { profile.name = name }
        if (lastname) { profile.lastname = lastname }
        if (image) { profile.image = image }

        await user.update({ profile })
        return user.getPublicInfo()
    },

    async getPayments (user) {
        return user.getPaymentsInfo()
    },

    async setPayments (user, data) {
        const type = data.type
        const credentials = data.credentials

        if (!type || !credentials || !Object.keys(credentials).length) {
            throw new exception.PaymentsValidation()
        }

        // TODO: validate provider creadentials

        let payments = user.payments || []

        payments.push({
            type: data.type,
            credentials: data.credentials,
            active: true
        })

        try {
            user = await user.update({ payments })
            return user.getPaymentsInfo()
        } catch (error) {
            throw new exception.PaymentsValidation()
        }
    },

    async deletePayment (user, paymentId) {
        if (!paymentId) {
            throw new exception.PaymentsValidation()
        }

        let payments = user.payments.filter((payment) => {
            return payment.id !== paymentId
        })

        if (user.payments.length !== payments.length) {
            user.payments = payments
            user = await user.save()
        }

        return user.getPaymentsInfo()
    }
}
