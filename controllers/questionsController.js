/* eslint-disable camelcase */
const Question = require('../models/questionModel');

const getQuestions = (productId) => {
  // limit count to page and count ?
  return Question.find({product_id: productId}, '-_id question_id question_body question_date asker_name question_hepfulness reported answers')
    .then(questions => {
      // filter out the reported questions
      return questions;
    });
};

// const postQuestion =

const markQuestionHelpful = (questionId) => {
  return Question.findOneAndUpdate({question_id: questionId}, {$inc: {question_helpfulness: 1}})
    .then(result => result);
};

const reportQuestion = (questionId) => {
  return Question.findOneAndUpdate({question_id: questionId}, {$set: {reported: true}})
    .then(result => result);
};

module.exports = { getQuestions, markQuestionHelpful, reportQuestion };