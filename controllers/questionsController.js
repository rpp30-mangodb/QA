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
const getLastQuestionId = () => {
  return Question.find({}).sort({'question_id': -1}).limit(1);
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
  let questionId;
  return getLastQuestionId()
    .then(doc => {
      questionId = doc[0].question_id;
      console.log('before ques id', questionId);
      questionId++;
      console.log('after ques id', questionId);
    })
    .then(() => {
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

module.exports = { getQuestions, getLastQuestionId, saveDoc, postQuestion, markQuestionHelpful, reportQuestion };