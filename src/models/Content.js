'use strict'

const base = require('./_Base')

module.exports = (sequelize, DataTypes) => {
    let Content = sequelize.define('content', Object.assign({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false
        },

    }, base), {
        timestamps: true,
        defaultScope: {
            where: {
                actived: true,
                removed: false
            },
            order: [
                ['id', 'DESC']
            ]
        },
        indexes: [
            {
                unique: true,
                fields: ['name']
            },
            {
                unique: true,
                fields: ['slug']
            }
        ]
    })

    Content.getAll = function ({ offset, limit }) {
        return this.findAll({
            offset,
            limit
        })
    }

    Content.getOneBySlug = function (slug) {
        return this.findOne({
            where: {
                slug: slug
            }
        })
    }

    Object.assign(Content.prototype, {
        getPublicInfo () {
            return {
                name: this.name,
                slug: this.slug
            }
        }
    })

    return Content
}
