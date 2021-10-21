const mongoose = require('mongoose');
const { Schema } = mongoose;

const photoSchema = new Schema({
  'id': {type: Number, required: true},
  'answer_id': {type: Number, required: true},
  'url': {type: String, required: true}
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;