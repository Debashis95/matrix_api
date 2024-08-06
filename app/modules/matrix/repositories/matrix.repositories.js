const MatrixResult = require("matrix/model/matrix.model");
const User = require("user/model/user.model");
const mongoose = require("mongoose");


const matrixRepository = {
  save: async (data) => {
    try {
      let result = await MatrixResult.create(data);
      if (!result) {
        return null;
      }
      return result;
    } catch (e) {
      return e;
    }
  },

  getAllByField: async (params) => {
    try {
      let results = await MatrixResult.find(params).lean().exec();
      if (!results) {
        return null;
      }
      return results;
    } catch (e) {
      return e;
    }
  },

  getOperationCounts: async () => {
    try {
      let counts = await MatrixResult.aggregate([
        { $group: { _id: "$operation", count: { $sum: 1 } } },
      ]);
      return counts;
    } catch (e) {
      return e;
    }
  },

  getTopUsers: async (limit) => {
    try {
      let topUsers = await MatrixResult.aggregate([
        { $group: { _id: "$user", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
      ]);
      return topUsers;
    } catch (e) {
      return e;
    }
  },

  saveResult: async (userId, operationType) => {
    try {
      let user = await User.findByIdAndUpdate(
        userId,
        { $inc: { [`operationCounts.${operationType}`]: 1 } },
        { new: true }
      );
      if (!user) {
        return null;
      }
      return user.operationCounts;
    } catch (e) {
      return e;
    }
  },

  getDashboardData: async () => {
    const operationCounts = await MatrixResult.aggregate([
      { $group: { _id: "$operation", count: { $sum: 1 } } },
    ]);

    const topUsers = await MatrixResult.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $project: { _id: 1, count: 1, "userDetails.full_name": 1 } },
    ]);

    return { operationCounts, topUsers };
  },

  getUserPerformance: async (userId) => {
    return await MatrixResult.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$operation", count: { $sum: 1 } } },
    ]);
  },
};

module.exports = matrixRepository;
