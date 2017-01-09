const config = {
  env: process.env.NODE_ENV || 'development',
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
    controllers: `${__dirname}/controllers`,
    logs: `${__dirname}/logs`,
    middleware: `${__dirname}/middleware`,
    modules: `${__dirname}/modules`,
    routes: `${__dirname}/routes`,
    schemas: `${__dirname}/schemas`,
    utils: `${__dirname}/utilities`
  },
  server: {
    port: process.env.PORT || 3000,
    root: __dirname,
    utcOffset: 60
  }
};

module.exports = config;
