const fs = require('fs');

const folderModule = (path) => {
  let moduleConstruct = {};

  fs.readdirSync(`${path}/`).forEach((file) => {
    if(file.match(/\.js$/) !== null && file !== 'index.js') {
      const name = file.replace('.js', '');
      moduleConstruct[name] = require(`${path}/${file}`);
    }
  });

  return moduleConstruct;
};

module.exports = {
  folderModule: folderModule
};
