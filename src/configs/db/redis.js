
const Redis = require('ioredis');
const {REDIS_HOST, REDIS_PORT, REDIS_PWD} = require('../config');
const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PWD,
});

redis.on('error', (err) => {console.log('Redis Error: '+ err)})
redis.on('connect', (err) => {console.log('Connected to Redis')})

module.exports = redis
