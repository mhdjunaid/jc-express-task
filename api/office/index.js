const express = require('express')
const router = express.Router()
const officesCtrl = require('../../controllers/offices');
const { models } = require('../../database/models');
const { parseOptionsReq } = require('../../lib/utils');
const authenticate = require('../../lib/middlewares/authenticate');

router.post('/', authenticate(), async (req, res) => {
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

router.put('/:id', authenticate(), async (req, res) => {
  const officeId = req.params.id;
  req.office = await officesCtrl.getOffice(officeId); // get office model to be updated
  await officesCtrl.editOffice({ office: req.office, ...req.body })
    .then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while updating office"
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

router.delete('/:id', authenticate(), async (req, res) => {
  const officeId = req.params.id;
  await officesCtrl.removeOffice({ officeId }).then(count => {
    if (count == 1) {
      res.send({
        message: "Office was deleted successfully!"
      });
    } else {
      res.send({
        message: err.message || `Cannot delete Office with id=${officeId}.`
      });
    }
  })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Office with id=" + officeId
      });
    });
});

module.exports = router;