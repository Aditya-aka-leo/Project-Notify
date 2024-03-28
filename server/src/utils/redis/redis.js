const { createClient } = require("redis");

const getClient = async () => {
  const client = createClient({
    url: `${process.env.REDIS_API_KEY}`,
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  return client;
};

module.exports = { getClient };