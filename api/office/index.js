const express = require('express')
const router = express.Router()
const officesCtrl = require('../../controllers/offices');
const { models } = require('../../database/models');
const { parseOptionsReq } = require('../../lib/utils');

router.post('/', async (req, res) => {
  const { name, number, towerId } = req.body;
  await officesCtrl.createOffice({ name, number, towerId })
    .then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating office"
      });
    });
});

router.get('/', async (req, res) => {
  const options = parseOptionsReq(req);
  await models.Office.findAll({
    offset: options.offset || 0,
    limit: options.limit || 10,
    where: options.where || {},
    order: options.order || []
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving offices."
    });
  });
});

router.delete('/:id', async (req, res) => {
  const towerId = req.params.id;
  await models.Tower.destroy({
    where: {
      id: towerId
    }
  }).then(count => {
    if (count == 1) {
      res.send({
        message: "Office was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Office with id=${towerId}.`
      });
    }
  })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Office with id=" + towerId
      });
    });
});

module.exports = router;