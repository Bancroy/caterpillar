const fs = require('fs');

function defer() {
  const deferred = {};

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
}

function folderModule(path) {
  let moduleConstruct = {};

  fs.readdirSync(`${path}/`).forEach((file) => {
    if(file.match(/\.js$/) !== null && file !== 'index.js') {
      const name = file.replace('.js', '');
      moduleConstruct[name] = require(`${path}/${file}`);
    }
  });

  return moduleConstruct;
};

function getStackTrace() {
  let result = {};
  Error.captureStackTrace(result, getStackTrace);
  return result.stack;
}

module.exports = {
  defer: defer,
  folderModule: folderModule,
  getStackTrace: getStackTrace
};
