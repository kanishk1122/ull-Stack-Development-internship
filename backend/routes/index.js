const express = require("express");
const router = express.Router();

module.exports = (pool, models, producer, kafkaState) => {
  router.use("/auth", require("./auth")(pool, models));
  router.use("/users", require("./users")(pool, models));
  router.use("/stores", require("./stores")(pool, models));
  router.use("/owner", require("./owner")(pool));
  router.use(
    "/ratings",
    require("./ratings")(pool, models, producer, kafkaState)
  );
  router.use("/admin", require("./admin")(pool));

  return router;
};
