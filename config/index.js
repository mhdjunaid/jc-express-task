const path = require('path');
const url = require('url');
const _ = require('lodash');

const NODE_ENV = process.env.NODE_ENV || 'development';
const hasDBURL = !!process.env.DBURL;

// we gradually add data to it
const config = {};
try {
  const fileConfig = require(`./env/${NODE_ENV}`);
  console.log('loaded from file:', Object.keys(fileConfig).join(', '));
  _.merge(config, fileConfig);
}
catch (e) {
  console.log('unable to load config from file', `./env/${NODE_ENV}`);
}

if (hasDBURL) {
  const dbOptions = url.parse(process.env.DBURL);
  const [username, password] = dbOptions.auth.split(':');
  console.log('setting db options from DBURL');
  const dbConfig = {
    database: dbOptions.path.substr(1),
    username,
    password,
    dialect: dbOptions.protocol.slice(0, -1),
    host: dbOptions.host,
    define: {
      underscored: true,
      paranoid: true
    }
  };
  _.merge(config, {
    db: dbConfig
  });
}

if (!config.dbModelsPaths) {
  config.dbModelsPaths = [];
}
config.dbModelsPaths.push(path.resolve(__dirname, '../database/models'));
console.log('DB model paths: %O', config.dbModelsPaths);
module.exports = config;