const matrixRepo = require("matrix/repositories/matrix.repositories");

class MatrixController {
  async saveMatrices(req, res) {
    try {
      const { matrixA, matrixB, operation, result, userId } = req.body;
      let saveResult = await matrixRepo.save({
        matrixA,
        matrixB,
        operation,
        result,
        user: userId,
      });
      if (saveResult) {
        return res.status(200).send({
          message: "Matrix result saved successfully",
          saveResult,
        });
      } else {
        return res.status(400).send({
          message: "Failed to save matrix result",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async getDashboard(req, res) {
    try {
      const { operationCounts, topUsers } = await matrixRepo.getDashboardData();
      res.status(200).json({ operationCounts, topUsers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserPerformance(req, res) {
    try {
      const userId = req.params.userId;
      const userPerformance = await matrixRepo.getUserPerformance(userId);
      res.status(200).json({ userId, performance: userPerformance });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MatrixController();
