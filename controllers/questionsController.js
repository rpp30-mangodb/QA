/* eslint-disable camelcase */
const fs = require('fs');
const Question = require('../models/questionModel');

const getQuestions = (productId) => {
  // limit count to page and count ?
  return Question.find({product_id: productId, reported: false}, '-_id question_id question_body question_date asker_name question_helpfulness reported answers')
    .then(questions => {
      // console.log('controller questions', questions);
      return questions;
    });
};

// post question helpers
const readIds = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      } else {
        let dataIds = data.split(',');
        let questionData = dataIds[0].split(':');
        let questionId = questionData[1];
        console.log('before id', questionId);
        const idData = { questionId, dataIds };
        resolve(idData);
      }
    });
  });
};

const writeIds = (path, idData) => {
  const questionId = parseInt(idData.questionId) + 1;
  console.log('after id', questionId);
  const dataIds = idData.dataIds.join(',');
  let newIds = 'questions:' + questionId + ',' + dataIds;
  console.log(newIds);
  return new Promise((resolve, reject) => {
    fs.writeFile(path, newIds, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(questionId);
      }
    });
  });
};

const saveDoc = (postData, questionId) => {
  return new Promise((resolve, reject) => {
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
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// post question utilizing helper functions
const postQuestion = (postData) => {
  return readIds(__dirname + '/../ids.txt')
    .then((idsData) => {
      return writeIds(__dirname + '/../ids.txt', idsData);
    })
    .then(questionId => {
      return saveDoc(postData, questionId);
    })
    .catch(err => console.log(err));
};

const markQuestionHelpful = (questionId) => {
  return Question.findOneAndUpdate({question_id: questionId}, {$inc: {question_helpfulness: 1}})
    .then(result => result);
};

const reportQuestion = (questionId) => {
  return Question.findOneAndUpdate({question_id: questionId}, {$set: {reported: true}})
    .then(result => result);
};

module.exports = { getQuestions, readIds, writeIds, saveDoc, postQuestion, markQuestionHelpful, reportQuestion };