const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { db: dbConfig, dbModelsPaths } = require('../../config');
const models = {};
const modelsByTableName = {};
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password,
  Object.assign({}, dbConfig, {
    logging: str => console.log(str)
  }));

function loadModelFiles(files) {
  const loadedModels = {};
  files.forEach((file) => {
    let model;
    try {
      model = require(file);
    }
    catch (e) {
      if (e instanceof SyntaxError) {
        console.error('Unable to load model', file);
        console.error(e);
        return;
      }
      throw e;
    }
    loadedModels[model.name] = model;
  });

  // Collect
  Object.values(loadedModels).forEach((model) => {
    models[model.name] = model;
  });
}
function loadModels(modelsPath) {
  const files = fs.readdirSync(modelsPath)
    .filter(f => f !== 'index.js')
    .filter(f => f.endsWith('.js'))
    .map(f => path.join(modelsPath, f));
  loadModelFiles(files);
}

function initializeModels() {
  Object.values(models).forEach((model) => {
    try {
      if (model.init) {
        model.init(sequelize, Sequelize);
      }
      else {
        models[model.name] = model(sequelize, Sequelize);
      }
    }
    catch (e) {
      console.error(e);
      console.error('Unable to init model', model.name);
      throw e;
    }
  });
  // Set global maps to configure for generic api calls
  Object.values(models).forEach((model) => {
    models[model.name] = model;
    modelsByTableName[model.tableName] = model;
  });

  // Associate so that fk relation added in respective models(towerId in office)
  Object.values(models).forEach((model) => {
    if ('associate' in model) {
      model.associate(models);
    }
  });
  // Post associate
  Object.values(models).forEach((model) => {
    if ('postAssociate' in model) {
      model.postAssociate(models);
    }
  });
}
// so it is accessible from models being loaded next
exports.models = models;

async function initialize(opts = { force: false }) {
  const { force } = opts;
    dbModelsPaths.forEach(loadModels);
    initializeModels();
  await sequelize.sync({
    force
  });
}

Object.assign(exports, {
  sequelize, Sequelize, modelsByTableName, initialize
});
