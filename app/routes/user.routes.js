const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const multer = require("multer");
const userController = require("user/controller/user.controller");

const fs = require("fs");

const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (!fs.existsSync("./public/uploads/user")) {
      fs.mkdirSync("./public/uploads/user");
    }
    callback(null, "./public/uploads/user");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, "_"));
  },
});

const uploadFile = multer({
  storage: Storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/jpg" &&
      file.mimetype !== "image/png"
    ) {
      req.fileValidationError = "Only support jpeg, jpg or png file types.";
      return cb(
        null,
        false,
        new Error("Only support jpeg, jpg or png file types")
      );
    }
    cb(null, true);
  },
});

namedRouter.post("user.signup", "/create", uploadFile.any(), userController.signup);
namedRouter.post("user.login", "/login", userController.signin);
// namedRouter.all("/user*", auth.authenticate)
namedRouter.get("user.dashboard", "/dashboard", userController.dashboard);
namedRouter.get("user.edit", "/edit/:id", userController.edit);
namedRouter.post("user.update", "/update", uploadFile.any(), userController.update);
namedRouter.get("user.verifyEmail", "/verify-email/:token", userController.verifyEmail);

module.exports = router;
