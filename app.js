var createError = require("http-errors");
var express = require("express");
var typeorm = require("typeorm");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var multer = require("multer");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var outputsRouter = require("./routes/output");
var inputRouter = require("./routes/input");
require("dotenv").config();
var app = express();
var multer = multer();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

typeorm
  .createConnection({
    type: process.env.TYPEORM_CONNECTION,
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [require("./entity/RecordSchema")]
  })
  .then(connection => {
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    app.use("/", indexRouter);
    app.use("/users", usersRouter);
    app.use("/output", outputsRouter);
    app.use("/input", inputRouter);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });

    return connection.manager;
  })
  .catch(error => {
    console.log("Error: ", error);
  });
module.exports = app;
