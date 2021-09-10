const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

client.on('connect', () => {
  console.log('Redis is connected');
});

client.on('ready', () => {
  console.log('Client is ready to use redis');
});

client.on('error', (err) => {
  console.log('Error ' + err);
});

client.on('end', () => {
  console.log('Client disconnected from redis');
});

process.on('SIGINT', () => {
  client.quit();
});

module.exports = client;
