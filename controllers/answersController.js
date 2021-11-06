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
const getLastPhotoId = () => {
  return Answer.find({}).sort({'photos.id': -1}).limit(1);
};

const getLastAnswerId = () => {
  return Answer.find({}).sort({'id': -1}).limit(1);
};

const saveDoc = (questionId, postData, answerId, photoArray) => {
  return new Promise((resolve, reject) => {
    const date = new Date().toISOString();
    console.log(date);
    const answer = new Answer({
      id: answerId,
      question_id: questionId,
      body: postData.body,
      date: date,
      answerer_name: postData.name,
      answerer_email: postData.email,
      photos: photoArray
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
  });
};


// post answer utilizing helper functions
const postAnswer = (questionId, postData) => {
  let answerId, photoId;
  let photoArray = [];
  if (postData.photos.length > 0) {
    return getLastPhotoId()
      .then(photoDoc => {
        console.log('photoDoc', photoDoc[0]);
        console.log('photos doc', photoDoc[0].photos);
        photoDoc[0].photos.sort((a, b) => b.id - a.id);
        photoId = photoDoc[0].photos[0].id;
        console.log('before photo id', photoId);
        for (var i = 0; i < postData.photos.length; i++) {
          photoId++;
          let photo = {id: photoId, url: postData.photos[i]};
          photoArray.push(photo);
        }
        console.log('after photo id', photoId);
      })
      .then(() => {
        return getLastAnswerId()
          .then(doc => {
            console.log('answer doc yes photo', doc);
            answerId = doc[0].id;
            console.log('before ans id', answerId);
            answerId++;
            console.log('after ans id', answerId);
          })
          .then(() => {
            return saveDoc(questionId, postData, answerId, photoArray);
          })
          .catch(err => console.log(err));
      });
  } else {
    return getLastAnswerId()
      .then(doc => {
        console.log('answer doc no photo', doc);
        answerId = doc[0].id;
        console.log('before ans id', answerId);
        answerId++;
        console.log('after ans id', answerId);
      })
      .then(() => {
        return saveDoc(questionId, postData, answerId);
      })
      .catch(err => console.log(err));
  }
};

const markAnswerHelpful = (answerId) => {
  return Answer.findOneAndUpdate({id: answerId}, {$inc: {helpfulness: 1}})
    .then(result => result);
};

const reportAnswer = (answerId) => {
  return Answer.findOneAndUpdate({id: answerId}, {$set: {reported: true}})
    .then(result => result);
};

module.exports = { getAnswers, getLastAnswerId, getLastPhotoId, saveDoc, postAnswer, markAnswerHelpful, reportAnswer };