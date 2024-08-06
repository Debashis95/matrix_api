const passport = require("passport");
const passportJWT = require("passport-jwt");
const users = require("user/model/user.model");
const config = require("../config/index");
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const params = {
  secretOrKey: config.auth.jwtSecret,
  jwtFromRequest: ExtractJwt.fromHeader("token"),
};

module.exports = () => {
  const strategy = new Strategy(params, (payload, done) => {
    console.log(params);
    let data = users.findById(payload.id);
    done(null, data);
  });

  passport.use(strategy);

  return {
    initialize: () => {
      return passport.initialize();
    },
    authenticate: (req, res, next) => {
      console.log("authentication exicuted");
      passport.authenticate("jwt", { session: false }, (err, user, info) => {
        console.log(err, "errrrrrrrrrr");
        if (err) {
          throw err;
          // return next(err);
        }

        console.log(user, "userrrrrrrrrrrrrrrrrrrr");
        req.user = user;
        return next();
      })(req, res, next);
    },
    // This is for webservice jwt token check //
    authenticateAPI: (req, res, next) => {
      passport.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
          return res.status(400).send({
            token_expire: true,
            auth: false,
            message:
              "Please provide a valid token, your token might be expired",
          });
        }
        if (!user) {
          return res.status(400).send({
            status: 400,
            token_expire: true,
            auth: false,
            message: "Sorry user not found!",
          });
        }
        req.user = user;
        return next();
      })(req, res, next);
    },
  };
};
