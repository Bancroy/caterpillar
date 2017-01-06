const config = {
  env: 'development',
  apiVersion: 'v0',
  database: {
    uri: process.env.DATABASE_URI || 'mongodb://localhost/caterpillar',
    options: {
      server: {
        poolSize: 100,
        reconnectInterval: 500,
        reconnectTries: 60,
        socketOptions: { keepAlive: 120 }
      }
    }
  },
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
