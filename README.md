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
Clone the project 
```
$ git clone git@github.com:mhdjunaid/jc-express-task
$ cd jc-express-task
```
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

## REST APIs
### Tower
- GET: `curl localhost:3041/towers?show_with_offices=false&c[location]=auh&limit=10&offset=0&order=id` //c[field] to search by param
- POST: `curl --location --request POST 'localhost:3041/towers' \
--header 'Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDczMDgzMzV9.SgrvHrBJUpifOehQFBvHw9GrFyuOWqp6sJOGE79ZRI8' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name":"T1",
    "location":"auh",
    "rate":5,
    "lat":54.382951,
    "long":24.382951,
    "floors":5
}'`
- PUT: `curl --location --request PUT 'localhost:3041/towers/1' \
--header 'Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDcxNDAwNzR9.uYuy0QMw0Yum1pdS8kK8HGMtC6dFLtPrMWgPqKgxVFQ' \
--header 'Content-Type: application/json' \
--data-raw '{ "name":"fivestar2345"}'`
- DELETE: `curl --location --request DELETE 'localhost:3041/towers/2' \
--header 'Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDcxNDAwNzR9.uYuy0QMw0Yum1pdS8kK8HGMtC6dFLtPrMWgPqKgxVFQ' \
--data-raw ''`

