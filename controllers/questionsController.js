/* eslint-disable camelcase */
const fs = require('fs');
const Question = require('../models/questionModel');

const getQuestions = (productId) => {
  // limit count to page and count ?
  return Question.find({product_id: productId}, '-_id question_id question_body question_date asker_name question_helpfulness reported answers')
    .then(questions => {
      // filter out the reported questions
      // console.log('controller questions', questions);
      return questions;
    });
};

const postQuestion = (postData, cb) => {
  fs.readFile(__dirname + '/../ids.txt', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      cb(err);
    } else {
      let dataIds = data.split(',');
      let questionData = dataIds[0].split(':');
      let questionId = questionData[1];
      console.log('before id', questionId);
      questionId++;
      console.log('after id', questionId);
      dataIds.shift();
      dataIds.join(',');
      let newIds = 'questions:' + questionId + ',' + dataIds;
      console.log(newIds);
      fs.writeFile(__dirname + '/../ids.txt', newIds, err => {
        if (err) {
          console.log(err);
          cb(err);
        } else {
          const date = new Date().toISOString();
          console.log(date);
          const question = new Question({
            question_id: questionId,
            product_id: postData.product_id,
            question_body: postData.body,
            question_date: date,
            asker_name: postData.name,
            asker_email: postData.email
          });
          question.save((err, result) => {
            if (err) {
              console.log(err);
              cb(err);
            } else {
              cb(null, result);
            }
          });
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