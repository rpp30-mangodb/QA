/* eslint-disable camelcase */
const Question = require('../models/questionModel');

const getQuestions = (productId, cb) => {
  // limit count to page and count ?
  return Question.find({product_id: productId}, '-_id question_id question_body question_date asker_name question_hepfulness reported answers')
    .then(questions => {
      // filter out the reported questions
      return questions;
    });
};

module.exports = { getQuestions };