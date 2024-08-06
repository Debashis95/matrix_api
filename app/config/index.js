// index..js
module.exports = {
   app: {
     port: process.env.PORT || 1575,
     appName: process.env.APP_NAME || "authentication",
     env: process.env.NODE_ENV || "development",
  
   },
   db: {
     port: process.env.DB_PORT || 27117,
     database: process.env.DB_DATABASE || "adreeDb",
     password: process.env.DB_PASSWORD || "7fyk6NyMf7yiDhLA",
     username: process.env.DB_USERNAME || "adree",
     host: process.env.DB_HOST || "104.211.217.29",
     dialect: "mongodb",
   },
   auth: {
     jwtSecret: process.env.JWT_SECRET || "MyS3cr3tK3Y",
     jwt_expiresin: process.env.JWT_EXPIRES_IN || "1d",
     saltRounds: process.env.SALT_ROUND || 10,
     jwtSession: { session: false },
     refresh_token_secret:
       process.env.REFRESH_TOKEN_SECRET || "VmVyeVBvd2VyZnVsbFNlY3JldA==",
     refresh_token_expiresin: process.env.REFRESH_TOKEN_EXPIRES_IN || "2d", // 2 days
   },
 };
 