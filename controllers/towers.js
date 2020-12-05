const { models } = require('../database/models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const redis = require('redis');
const { promisify } = require('util');
const config = require('../config');
let redisClient;
let get;
let set;
if (config.redis) {
    redisClient = redis.createClient(config.redis);
    get = promisify(redisClient.get).bind(redisClient);
    set = promisify(redisClient.set).bind(redisClient);
}
else {
    console.log('WARNING: Redis is not configured and no results will be cached');
}

const ctrlTowers = {
    async createTower({
        name, rate, lat, long, floors, location
    }) {
        return models.Tower.createTower({
            name, rate, lat, long, floors, location
        });
    },
    async listTowers({
        options, showWithOffices
    }) {
        const where = {
            ...options.where
        };
        if (showWithOffices && JSON.parse(showWithOffices) === true) {
            where.officeCount = {
                [Op.gte]: 1 // Only include if office count is > 0
            };
        }
        options.where = where;
        if (!redisClient) {
            console.log('WARNING: Redis is not configured!! Calling db directly');
            return models.Tower.listTowers({
                options
            });
        }
        else {
            // Try to get from redis catch for this options
            const towerCache = JSON.parse(await get(JSON.stringify(options)));
            if (!towerCache) {
                const towers =  await models.Tower.listTowers({
                    options
                });
                console.log('Saving tower list in cache');
                // Invalidation logic is upon deletion/creation/update of towers
                await set(JSON.stringify(options), JSON.stringify({
                    towers
                }));
                // Save to cache and return
                return towers;
            }
            // directly from cache
            return towerCache.towers;
        }
    }
};

module.exports = ctrlTowers;
