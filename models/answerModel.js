const mongoose = require('mongoose');
const { Schema } = mongoose;

const answerSchema = new Schema({
  'id': {type: Number, required: true},
  'body': {type: String, required: true},
  'date': {type: Date, required: true},
  'answerer_name': {type: String, required: true},
  'answerer_email': {type: String, required: true},
  'helpfulness': {type: Number, required: true},
  'reported': {type: Boolean, default: false}, // update when it is true
  'photos': [{type: String}] // are users required to upload photos?
});

const answer = mongoose.model('Answer', answerSchema);

module.exports = { answer };