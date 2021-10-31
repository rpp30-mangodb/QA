/* eslint-disable camelcase */
const fs = require('fs');
const Answer = require('../models/answerModel');

const getAnswers = (questionId) => {
  // limit count to page and count?
  return Answer.findOne({question_id: questionId}, '-_id id body date answerer_name helpfulness photos')
    .then(answers => {
      // filter out reported answers
      return {questionId, answers};
    });
};

const postAnswer = (questionId, postData) => {
  // need callback to return to frontend ???
  // use fs with promises???
  fs.readFile('../ids/answerId.txt', utf8, (err, data) => {
    if (err) {
      console.log(err); // need a callback?
    } else {
      var id = data;
      id++;
      fs.writeFile('../ids/answerId.txt', id, err => {
        if (err) {
          console.log(err);
        } else {
          const date = new Date().toISOString();
          console.log(date);
          // read and write photo ids
          fs.readFile('../ids/photoId.txt', utf8, (err, data) => {
            if (err) {
              console.log(err); // need a callback?
            } else {
              let id = data;
              let photos = postData.photos;
              photos = photos.map(photo => {
                id++;
                photo.id = id;
                return photo;
              });
              fs.writeFile('../ids/photoId.txt', id, err => {
                if (err) {
                  console.log(err);
                } else {
                  return Answer.save({
                    id: id,
                    question_id: questionId,
                    body: postData.body,
                    date: date,
                    answerer_name: postData.name,
                    answerer_email: postData.email,
                    photos: photos // check post answer form to check data
                  })
                    .then(result => result);
                }
              });
            }
          });
        }
      });
    }
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