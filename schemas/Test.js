const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true }
});

module.exports = testSchema;
