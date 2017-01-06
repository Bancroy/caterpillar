const folderModule = require(`${_config.paths.utils}/bundle`).folderModule;

const constructedModule = folderModule(__dirname);

function attachRoutes(app, root) {
  for(const namespace in constructedModule) {
    app.use(`${root}/${namespace}`, constructedModule[namespace]);
  }
}

module.exports = attachRoutes;
