const express = require("express");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const matrixController = require("matrix/controller/matrix.controller");

namedRouter.post(
  "matrix.save",
  "/save-matrices",
  matrixController.saveMatrices
);
// namedRouter.post(
//   "matrix.operation",
//   "/record-operation",
//   matrixController.saveOperation
// );
namedRouter.get(
  "matrix.dashboard",
  "/dashboard",
  matrixController.getDashboard
);

namedRouter.get(
  "matrix.userPerformance",
  "/user-performance/:userId",
  matrixController.getUserPerformance
);



module.exports = router;
