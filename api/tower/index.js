const express = require('express')
const router = express.Router()
const towersCtrl = require('../../controllers/towers');
const { models } = require('../../database/models');
const { parseOptionsReq } = require('../../lib/parseUtil');
const authenticate = require('../../lib/middlewares/authenticate');
const redis = require('redis');
const { promisify } = require('util');
const config = require('../../config');

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

router.post('/', authenticate(), async (req, res) => {
    // invalidate redis cache for listint as tower list is updated
    redisClient.flushall();
    await towersCtrl.createTower({ ...req.body })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating tower"
            });
        });
});

router.put('/:id', authenticate(), async (req, res) => {
    // invalidate redis cache for listing as tower list is updated
    redisClient.flushall();
    const towerId = req.params.id;
    req.tower = await towersCtrl.getTower(towerId); // get tower model to be updated
    await towersCtrl.editTower({ tower: req.tower, ...req.body })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while updating tower"
            });
        });
});

router.get('/', async (req, res) => {
    const options = parseOptionsReq(req);
    const showWithOffices = req.query.show_with_offices;
    await towersCtrl.listTowers({ options, showWithOffices })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while getting tower list"
            });
        });
});

router.delete('/:id', authenticate(), async (req, res) => {
    const towerId = req.params.id;
    // invalidate redis cache for listing as tower list is updated
    redisClient.flushall();
    await models.Tower.destroy({
        where: {
            id: towerId
        }
    }).then(count => {
        if (count == 1) {
            res.send({
                message: "Tower was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Tower with id=${towerId}.`
            });
        }
    })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tower with id=" + towerId
            });
        });
});

module.exports = router;