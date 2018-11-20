'use strict'

const base = require('./_Base')

module.exports = (sequelize, DataTypes) => {
    let Topic = sequelize.define('topic', Object.assign({
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
        }
    }, base), {
        timestamps: true,
        defaultScope: {
            where: {
                actived: true,
                removed: false
            },
            order: [
                ['id', 'ASC']
            ]
        },
        indexes: [
            {
                unique: true,
                fields: ['name', 'contentId']
            },
            {
                unique: true,
                fields: ['slug', 'contentId']
            }
        ]
    })

    Topic.associate = function (models) {
        Topic.belongsTo(models.Content)
    }

    Topic.getAll = function (content, { offset, limit }) {
        return this.findAll({
            where: {
                contentId: content.id
            },
            offset,
            limit
        })
    }

    Topic.getOneBySlug = function (content, slug) {
        return this.findOne({
            where: {
                contentId: content.id,
                slug: slug
            }
        })
    }

    Object.assign(Topic.prototype, {
        getPublicInfo () {
            return {
                name: this.name,
                slug: this.slug
            }
        }
    })

    return Topic
}
