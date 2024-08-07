const User = require("user/model/user.model");
const _ = require("underscore");
const userRepo = require("user/repositories/user.repositories");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const sendEmail = require('../../../helper/mailer');
class UserController {
  async dashboard(req, res) {
    try {
      return res.status(200).json({
        message: "Welcome to Dashboard",
      });
    } catch (error) {
      console.error("Error message", error);
    }
  }

  /**
   *@method signup
   *@description create new user
   */
   async signup(req, res) {
    try {
      console.log(req.body);
      const newUser = new User();
      
      req.body.password = newUser.generateHash(req.body.password);
      req.body.email = req.body.email.trim().toLowerCase();
  
      if (req.body.first_name && req.body.last_name) {
        req.body.full_name = req.body.first_name + " " + req.body.last_name;
      }
  
      if (req.files && req.files.length) {
        for (let file of req.files) {
          req.body[file.fieldname] = file.filename;
        }
      }
  
      req.body.emailVerificationToken = crypto.randomBytes(20).toString('hex');
      req.body.isEmailVerified = false;
  
      let saveUser = await userRepo.save(req.body);
      if (_.isObject(saveUser) && saveUser._id) {
        const verificationLink = `${process.env.HOST_URL}/verify-email/${saveUser.emailVerificationToken}`;
        const emailResult = await sendEmail(saveUser.email, 'Verify your email', `Please click this link to verify your email: ${verificationLink}`);
        
        if (emailResult.success) {
          return res.status(200).send({
            message: "User created successfully. Please check your email to verify your account.",
            saveUser,
          });
        } else {
          return res.status(200).send({
            message: "User created successfully, but there was an issue sending the verification email. Please contact support.",
            saveUser,
          });
        }
      } else {
        return res.status(400).send({
          message: "Failed to create new user",
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  /**
   *@method signin
   *@description login  user
   */

   async signin(req, res) {
    try {
      req.body.email = req.body.email.trim().toLowerCase();
      let isUserExists = await userRepo.fineOneWithEmail(req.body);
  
      if (isUserExists.status == 500) {
        return res.send({
          message: isUserExists.message,
        });
      } else if (isUserExists.status == 200) {
        if (!isUserExists.data.isEmailVerified) {
          return res.status(403).send({
            message: "Please verify your email before logging in.",
          });
        }
  
        const token = jwt.sign(
          {
            id: isUserExists.data._id,
            email: isUserExists.data.email,
          },
          process.env.JWT_SECRET || "ME3DS8TY2N",
          { expiresIn: "5m" }
        );
  
        res.cookie("token", token);
        return res.send({
          message: isUserExists.message,
          data: isUserExists.data,
          token
        });
      }
    } catch (err) {
      throw err;
    }
  }
  

  async edit(req, res) {
    try {
      let userData = await userRepo.getById(req.params.id);
      if (!_.isEmpty(userData)) {
        return res.status(200).json({
          success: true,
          message: "User data retrieved successfully",
          data: userData
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "User Not Found!"
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message
      });
    }
  }
  
  /**
   * @Method update
   * @Description To Update User Data
   */
  async update(req, res) {
    try {
      req.body.email = req.body.email.trim().toLowerCase();
      if (_.isEmpty(req.body.email)) {
        return res.status(400).json({
          success: false,
          message: "Email should not be empty!"
        });
      }
  
      const userId = req.body.id;
      let isEmailExists = await userRepo.getByField({
        email: { $regex: "^" + req.body.email + "$", $options: "i" },
        _id: { $ne: userId },
        isDeleted: false,
      });
  
      if (!_.isEmpty(isEmailExists)) {
        return res.status(400).json({
          success: false,
          message: "Email Already Exists!"
        });
      }
  
      let userData = await userRepo.getById(userId);
      if (req.files.length > 0) {
        req.body.profile_image = req.files[0].filename;
        if (!_.isEmpty(userData) && !_.isEmpty(userData.profile_image) && fs.existsSync("./public/uploads/user/" + userData.profile_image)) {
          fs.unlinkSync("./public/uploads/user/" + userData.profile_image);
        }
      }
  
      let userUpdate = await userRepo.updateById(req.body, userId);
      if (!_.isEmpty(userUpdate) && userUpdate._id) {
        return res.status(200).json({
          success: true,
          message: "User Updated Successfully",
          data: userUpdate
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "User Failed To Update!"
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message
      });
    }
  }

    
  /**
   * @Method emailVerification
   * @Description To verify Email
   */
  
  async verifyEmail(req, res) {
    try {
      const user = await userRepo.getByField({ emailVerificationToken: req.params.token });
      if (!user) {
        return res.status(400).send({ message: 'Invalid or expired verification token' });
      }
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      await userRepo.updateById(user, user._id);
      res.status(200).send({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
  

}

module.exports = new UserController();
