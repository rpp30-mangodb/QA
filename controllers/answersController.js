/* eslint-disable camelcase */
const fs = require('fs');
const Answer = require('../models/answerModel');

const getAnswers = (questionId) => {
  // limit count to page and count?
  return Answer.find({question_id: questionId, reported: false}, '-_id id body date answerer_name helpfulness photos')
    .then(answers => {
      return {questionId, answers};
    });
};

// post answer helper functions
const readIds = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      } else {
        let dataIds = data.split(','); // [questions:123, answers:332, photos:28394]
        const questionData = dataIds.shift();
        let answerData = dataIds[0].split(':'); // [answers, 332]
        let answerId = answerData[1];
        console.log('before ans id', answerId);
        let photoData = dataIds[1].split(':'); // [photos, 24332]
        let photoId = photoData[1];
        console.log('before photo id', photoId);
        const idData = { questionData, answerId, photoId };
        resolve(idData);
      }
    });
  });
};

const writeIds = (path, postData, idData) => {
  const questionData = idData.questionData;
  const answerId = idData.answerId + 1;
  console.log('after ansid', answerId);
  let photoId = idData.photoId;
  let photoArray = [];
  if (postData.photos) {
    for (var i = 0; i < postData.photos.length; i++) {
      photoId++;
      photoArray.push({id: photoId, url: postData.photos[i]});
    }
  }
  console.log('after photoId', photoId);
  let newIds = questionData + ',answers:' + answerId + ',photos:' + photoId;
  console.log(newIds);
  return new Promise((resolve, reject) => {
    fs.writeFile(path, newIds, (err, result) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const answerAndPhotosData = {answerId, photoArray};
        resolve(answerAndPhotosData);
      }
    });
  });
};

const saveDoc = (questionId, postData, ansAndPhotoData) => {
  const date = new Date().toISOString();
  console.log(date);
  const answer = new Answer({
    id: ansAndPhotoData.answerId,
    question_id: questionId,
    body: postData.body,
    date: date,
    answerer_name: postData.name,
    answerer_email: postData.email,
    photos: ansAndPhotoData.photoArray // check post answer form to check data
  });
  console.log('controller new answer', answer);
  answer.save((err, result) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      resolve(result);
    }
  });
};

// post answer utilizing helper functions
const postAnswer = (questionId, postData, cb) => {
  return readIds(__dirname + '/../ids.txt')
    .then(idsData => {
      return writeIds(__dirname + '/../ids.txt', idsData);
    })
    .then(ansAndPhotoData => {
      return saveDoc(questionId, postData, ansAndPhotoData);
    })
    .catch(err => console.log(err));
};

const markAnswerHelpful = (answerId) => {
  return Answer.findOneAndUpdate({id: answerId}, {$inc: {helpfulness: 1}})
    .then(result => result);
};

const reportAnswer = (answerId) => {
  return Answer.findOneAndUpdate({id: answerId}, {$set: {reported: true}})
    .then(result => result);
};

module.exports = { getAnswers, readIds, writeIds, saveDoc, postAnswer, markAnswerHelpful, reportAnswer };