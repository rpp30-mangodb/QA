/* eslint-disable camelcase */
const fs = require('fs');
const Answer = require('../models/answerModel');

const getAnswers = (questionId) => {
  // limit count to page and count?
  return Answer.find({question_id: questionId, reported: false}, '-_id id body date answerer_name helpfulness photos')
    .then(answers => {
      // filter out reported answers
      return {questionId, answers};
    });
};

const postAnswer = (questionId, postData, cb) => {
  fs.readFile(__dirname + '/../ids.txt', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      cb(err);
    } else {
      let dataIds = data.split(','); // [questions:123, answers:332, photos:28394]
      const questionData = dataIds.shift();
      let answerData = dataIds[0].split(':'); // [answers, 332]
      let answerId = answerData[1];
      console.log('before ans id', answerId);
      answerId++;
      console.log('after ansid', answerId);
      let photoData = dataIds[1].split(':'); // [photos, 24332]
      let photoId = photoData[1];
      console.log('before photo id', photoId);
      let photoArray = [];
      if (postData.photos) {
        for (var i = 0; i < postData.photos.length; i++) {
          photoId++;
          photoArray.push({id: photoId, url: postData.photos[i]});
        }
      }
      console.log('after ansid', photoId);
      let newIds = questionData + ',answers:' + answerId + ',photos:' + photoId;
      console.log(newIds);
      fs.writeFile(__dirname + '/../ids.txt', newIds, err => {
        if (err) {
          console.log(err);
        } else {
          const date = new Date().toISOString();
          console.log(date);
          const answer = new Answer({
            id: answerId,
            question_id: questionId,
            body: postData.body,
            date: date,
            answerer_name: postData.name,
            answerer_email: postData.email,
            photos: photoArray // check post answer form to check data
          });
          console.log('controller new answer', answer);
          answer.save((err, result) => {
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

const markAnswerHelpful = (answerId) => {
  return Answer.findOneAndUpdate({id: answerId}, {$inc: {helpfulness: 1}})
    .then(result => result);
};

const reportAnswer = (answerId) => {
  return Answer.findOneAndUpdate({id: answerId}, {$set: {reported: true}})
    .then(result => result);
};

module.exports = { getAnswers, postAnswer, markAnswerHelpful, reportAnswer };