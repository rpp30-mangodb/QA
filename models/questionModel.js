const mongoose = require('mongoose');
const answer = require('./answerModel');

const { Schema } = mongoose;

const questionSchema = new Schema({
  'question_id': {type: Number, required: true},
  'product_id': {type: Number, required: true},
  'question_body': {type: String, required: true},
  'question_date': {type: Date, required: true},
  'asker_name': {type: String, required: true},
  'asker_email': {type: String, required: true},
  'question_helpfulness': {type: Number, required: false, default: 0},
  'reported': {type: Boolean, required: false, default: false}, // update when it is true
  'answers': {type: Schema.Types.Mixed, required: false}
});

const Question = mongoose.model('Question', questionSchema, 'questions3');
// stress testing with questions4
// const Question = mongoose.model('Question', questionSchema, 'questions4');
// question.answers[answer.id]: answerSchema; move to controller?

module.exports = Question;