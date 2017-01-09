const mongoose = require('mongoose');

const database = require(`${_config.paths.modules}/database`);

const testSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, unique: true },
  success: { type: Boolean, required: true }
});

testSchema.statics.saveEntity = saveEntity;
testSchema.statics.getList = getList;
testSchema.statics.getById = getById;
testSchema.statics.removeById = removeById;
testSchema.statics.replaceEntity = replaceEntity;
testSchema.statics.updateById = updateById;

//////////////////////////////

function saveEntity(data) {
  return database.create('Test', data);
}

function getList() {
  return database.read('Test').run();
}

function getById(id) {
  return database.readOne('Test').where('_id').equals(id).run();
}

function removeById(id) {
  return database.deleteOne('Test').where('_id').equals(id).run();
}

function replaceEntity(id, newData) {
  return database.replace('Test', id, newData);
}

function updateById(id, changes) {
  return database.updateOne('Test', changes).where('_id').equals(id).run();
}

module.exports = testSchema;
