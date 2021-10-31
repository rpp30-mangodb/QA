const mongoose = require('mongoose');
const { Schema } = mongoose;

const answerSchema = new Schema({
  'id': {type: Number, required: true},
  'question_id': {type: Number, required: true},
  'body': {type: String, required: true},
  'date': {type: Date, required: true},
  'answerer_name': {type: String, required: true},
  'answerer_email': {type: String, required: true},
  'helpfulness': {type: Number, required: false, default: 0},
  'reported': {type: Boolean, required: false, default: false}, // update when it is true
  'photos': [{type: Schema.Types.Mixed}] // are users required to upload photos?
});

const Answer = mongoose.model('Answer', answerSchema, 'answersWithPhotos3');

module.exports = Answer;