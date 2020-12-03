const express = require('express')
const router = express.Router()
const towersCtrl = require('../../controllers/towers');
const { models } = require('../../database/models');
const { parseOptionsReq } = require('../../lib/utils');
const authenticate = require('../../lib/middlewares/authenticate');

router.post('/', authenticate(), async (req, res) => {
    const { name, lat, long, rate } = req.body;
    await towersCtrl.createTower({ name, lat, long, rate })
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating tower"
            });
        });
});

router.get('/', async (req, res) => {
    const options = parseOptionsReq(req);
    await models.Tower.findAll({
        offset: options.offset || 0,
        limit: options.limit || 10,
        where: options.where || {},
        order: options.order || []
    }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving towers."
        });
    });
});

router.delete('/:id', authenticate(), async (req, res) => {
    const towerId = req.params.id;
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