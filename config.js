const config = {
  apiVersion: 'v0',
  paths: {
    routes: `${__dirname}/routes`,
    utils: `${__dirname}/utilities`
  },
  server: {
    port: process.env.PORT || 3000,
    root: __dirname
  }
};

module.exports = config;
