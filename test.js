const redis = require("redis");

async function main() {
  const client = redis.createClient();

  client.on("error", (err) => {
    console.log("Error " + err);
  });

  await client.connect();
  console.log("Connected to Redis");
  console.log("hola no redis?");

  try {
    const reply = await client.set("mykey", "myvalue");
    console.log("Key-value pair set successfully:", reply);
  } catch (err) {
    console.log("Error setting key-value pair:", err);
  }

  await client.quit();
  console.log("Disconnected from Redis");
}

main();
console.log("Code execution completed.");
