const folderModule = require(`${_config.paths.utils}/bundle`).folderModule;

const constructedModule = folderModule(__dirname);

module.exports = constructedModule;
