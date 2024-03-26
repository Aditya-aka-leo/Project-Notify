const cors = require("cors");
const express = require("express");
const main_route = require("./src/routes/main");

const acquire = async () => {
  try {
    await require("./src/utils/kafka/admin").kafka_admin();
    console.log("Acquisition completed successfully");
  } catch (error) {
    console.error("Error during acquisition:", error);
    process.exit(1);
  }
};
acquire();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", main_route);

app.get("*", (req, res) => {
  res.send("<h1>404 Not Found it came </h1>");
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
