const User = require("user/model/user.model");
const userRepository = {

  getById: async (id) => {
    try {
      let user = await User.findById(id)
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  getByField: async (params) => {
    try {
      let user = await User.findOne(params).lean().exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  getAllByField: async (params) => {
    try {
      let user = await User.find(params).lean().exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },


  save: async (data) => {
    try {
      let user = await User.create(data);

      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      //console.log(e.message);
      return e;
    }
  },

  fineOneWithEmail: async (params) => {
    try {
      let user = await User.findOne({
        email: params.email,
      });
      if (!user) {
        throw {
          status: 500,
          data: null,
          message: "Authentication failed. User not found.",
        };
      }

      if (!user.validPassword(params.password, user.password)) {
        throw {
          status: 500,
          data: null,
          message: "Authentication failed. Wrong password.",
        };
      } else {
        return { status: 200, data: user, message: "Login Successfully" };
      }
    } catch (e) {
      return e;
    }
  },

  updateById: async (data, id) => {
    try {
      let user = await User.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  updateByField: async (data, param) => {
    try {
      let user = await User.updateOne(param, data, {
        new: true,
      });
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },
};

module.exports = userRepository;
