const mongoose = require('mongoose');
const { Schema } = mongoose;

const answerSchema = new Schema({
  'id': {type: Number, required: true},
  'question_id': {type: Number, required: true},
  'body': {type: String, required: true},
  'date': {type: Date, required: true},
  'answerer_name': {type: String, required: true},
  'answerer_email': {type: String, required: true},
  'helpfulness': {type: Number, default: 0},
  'reported': {type: Boolean, default: false}, // update when it is true
  // 'photos': [{type: String}] // are users required to upload photos?
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;