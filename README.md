# jc-express-task

Requirements
--------------
 1. PostgresSQL 
 2. PostGIS     
 3. Node.JS
 4. Redis
 
# Database
Create Postgres DB and test DB as postgres user:
```
CREATE DATABASE jc_task;
CREATE DATABASE jc_test_db;
```
To enable postgis run below in SQL command prompt of postgres for above created databases:
```
CREATE EXTENSION POSTGIS;
```
To install and start Redis on MAC
```
 $ brew install redis
 
 $ redis-server /usr/local/etc/redis.conf
 
 $ redis-cli ping
```
If it replies “PONG”, then it’s good to go!

# Installation
After copying the project run to install required dependencies:
```
$ npm install
```
Migration:
Update config/env/development.js and  config/env/test.js to local setup
```
  exports.db = {
    database: '<dbName>',
    username: '<dbUser>',
    password: '<dbPassword>',
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
```
```
$ npm install --save sequelize-cli
$ npx sequelize db:migrate  
```
Data Seed:
```
$ npx sequelize db:seed:all
```
Application Start:

```
$ npm install nodemon
$ NODE_ENV=development npx nodemon server.js 
```

Application Test:

```
$ npm test
```


