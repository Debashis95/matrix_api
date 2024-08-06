const mongoose = require("mongoose");

const MatrixResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    matrixA: [[Number]],
    matrixB: [[Number]],
    result: [[Number]],
    operation: {
      type: String,
      enum: ["add", "subtract", "multiply", "divide"],
    },
  },
  { timestamps: true, versionKey: false }
);

const MatrixResult = mongoose.model("MatrixResult", MatrixResultSchema);

module.exports = MatrixResult;
