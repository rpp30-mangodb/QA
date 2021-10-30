/* eslint-disable camelcase */
const Answer = require('../models/answerModel');

const getAnswers = (questionId) => {
  // limit count to page and count?
  return Answer.findOne({question_id: questionId}, '-_id id body date answerer_name helpfulness photos')
    .then(answers => {
      // filter out reported answers
      return {questionId, answers};
    });
};

module.exports = { getAnswers };