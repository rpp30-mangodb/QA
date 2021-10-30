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

const postQuestion = (productId, postData) => {
// need callback to return to frontend ???
  // use fs with promises???
  fs.readFile('../ids/answerId.txt', utf8, (err, data) => {
    if (err) {
      console.log(err); // need a callback?
    } else {
      let id = data;
      id++;
      fs.writeFile('../ids/answerId.txt', id, err => {
        if (err) {
          console.log(err);
        } else {
          const date = new Date().toISOString();
          console.log(date);
          Question.save({
            question_id: id,
            product_id: productId,
            question_body: postData.body,
            question_date: date,
            asker_name: postData.name,
            asker_email: postData.email
          })
            .then(result => result); // cb to get result to front end?
        }
      });
    }
  });
};

const markQuestionHelpful = (questionId) => {
  return Question.findOneAndUpdate({question_id: questionId}, {$inc: {question_helpfulness: 1}})
    .then(result => result);
};

const reportQuestion = (questionId) => {
  return Question.findOneAndUpdate({question_id: questionId}, {$set: {reported: true}})
    .then(result => result);
};

module.exports = { getQuestions, postQuestion, markQuestionHelpful, reportQuestion };