require("dotenv").config();
_ = require("underscore");
const express = require("express");
const { resolve, join } = require("path");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const namedRouter = require("route-label")(app);
const cors = require("cors");

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
); // get information from html forms
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "delivery@&beverage@#",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cors());

require("app-module-path").addPath(__dirname + "/app/modules");
global.appRoot = join(__dirname, "/app");
config = require(resolve(join(__dirname, "app/config", "index")));
global.auth = require(resolve(join(__dirname, "app/middleware", "auth")))();

namedRouter.use("user", "/user", require("./app/routes/user.routes"));
namedRouter.use("matrix", "/matrix", require("./app/routes/matrix.routes"));

app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, max-age=3600");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  auth = require(resolve(join(__dirname, "app/middleware", "auth")))(
    req,
    res,
    next
  );
  app.use(auth.initialize());
  if (req.session && req.session.token) {
    req.headers["token"] = req.session.token;
  }
  next();
});

(async () => {
  try {
    // Database connection//
    const port = process.env.DB_PORT || 3030;
    await require(resolve(join(__dirname, "app/config", "database")))();
    app.listen(port);
    console.log(
      `Project is running on ${`http://${process.env.HOST}:${port}`}`
    );
  } catch (error) {
    console.error(error);
  }
})();
