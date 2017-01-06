const config = {
  env: 'development',
  apiVersion: 'v0',
  paths: {
    logs: `${__dirname}/logs`,
    modules: `${__dirname}/modules`,
    routes: `${__dirname}/routes`,
    utils: `${__dirname}/utilities`
  },
  server: {
    port: process.env.PORT || 3000,
    root: __dirname,
    utcOffset: 60
  }
};

module.exports = config;
