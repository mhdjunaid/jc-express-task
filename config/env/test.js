  exports.db = {
    database: 'jc_test_db',
    username: 'postgres',
    password: 'junaid',
    dialect: 'postgres',
    define: {
      underscored: true,
      paranoid: true
    }
  };
  exports.JWT_SECRET = 'jc:Q911cNW,7-")36i)p}\'9]d?R>C\\';
  exports.redis = {
    host: 'localhost',
    port: 6379
  };
  exports.ES_URI = 'http://localhost:9200/';
