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

const markAnswerHelpful = (answerId) => {
  Answer.findOneAndUpdate({id: answerId}, {$inc: {helpfulness: 1}})
    .then(result => result);
};

const reportAnswer = (answerId) => {
  Answer.findOneAndUpdate({id: answerId}, {$set: {reported: true}})
    .then(result => result);
};

module.exports = { getAnswers, markAnswerHelpful, reportAnswer };