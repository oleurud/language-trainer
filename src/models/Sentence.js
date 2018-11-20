'use strict'

const base = require('./_Base')

module.exports = (sequelize, DataTypes) => {
    let Sentence = sequelize.define('sentence', Object.assign({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        source: {
            type: DataTypes.STRING,
            allowNull: false
        },
        translation: {
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
        }
    })

    Sentence.associate = function (models) {
        Sentence.belongsTo(models.Content)
        Sentence.belongsTo(models.Topic)
    }

    Sentence.findOneById = function (id) {
        return this.findOne({ where: { id } })
    }

    Sentence.getAllByContent = function (content, { offset, limit }) {
        return this.findAll({
            where: {
                contentId: content.id
            },
            offset,
            limit
        })
    }

    Sentence.getAllByContentAndTopic = function (content, topic, { offset, limit }) {
        return this.findAll({
            where: {
                contentId: content.id,
                topicId: topic.id
            },
            offset,
            limit
        })
    }

    Object.assign(Sentence.prototype, {
        getPublicInfo () {
            return {
                id: this.id,
                source: this.source,
                translation: this.translation
            }
        }
    })

    return Sentence
}
