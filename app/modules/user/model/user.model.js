const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bools = [true, false];

const UserSchema = mongoose.Schema(
  {
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    full_name: { type: String, default: "" },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    profile_image: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    isDeleted: { type: Boolean, default: false, enum: bools },
    isActive: { type: Boolean, default: true, enum: bools },
    matrixOperations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "MatrixResult" },
    ],
  },
  { timestamps: true, versionKey: false }
);

UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password, checkPassword) {
  return bcrypt.compareSync(password, checkPassword);
};

module.exports = mongoose.model("user", UserSchema);
