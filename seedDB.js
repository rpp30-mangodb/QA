const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
// const csvtojson = require('csvtojson');
const csv = require('csv-parser');
const Answer = require('./models/answerModel');
const Photo = require('./models/photoModel');
const Question = require('./models/questionModel');

const app = express();
const PORT = 5000;

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

mongoose.connect('mongodb://localhost:27017/atelier', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected!');
  parsePhotos();
  parseAnswers();
  parseQuestions();
});

var parsePhotos = () => {
  fs.createReadStream(path.resolve(__dirname, 'legacyData', 'answers_photos.csv'))
  // fs.createReadStream(path.resolve(__dirname, 'legacyData', 'test_photos.csv'))
    .pipe(csv({ }))
    .on('data', data => {
      // create model
      const photo = new Photo({
        'id': data.id,
        'answer_id': data.answer_id,
        'url': data.url
      });
      // save to mongo
      photo.save((err, answer) => {
        if (err) {
          console.log(err);
        } else {
          console.log(answer._id, 'saved');
        }
      });
    })
    .on('end', () => {
      console.log('read csv photo file');
    });
};

var parseAnswers = () => {
  fs.createReadStream(path.resolve(__dirname, 'legacyData', 'answers.csv'))
  // fs.createReadStream(path.resolve(__dirname, 'legacyData', 'test_answers.csv'))
    .pipe(csv({ }))
    .on('data', data => {
      // create model
      var date = parseInt(data.date_written);
      date = new Date(date).toISOString();
      var reported = data.reported;
      if (reported === 1) {
        reported = true;
      } else {
        reported = false;
      }
      const answer = new Answer({
        'id': data.id,
        'question_id': data.question_id,
        'body': data.body,
        'date': date,
        'answerer_name': data.answerer_name,
        'answerer_email': data.answerer_email,
        'helpfulness': data.helpful,
        'reported': reported
      });
        // save to mongo
      answer.save((err, answer) => {
        if (err) {
          console.log(err);
        } else {
          console.log(answer._id, 'saved');
        }
      });
    })
    .on('end', () => {
      console.log('read csv answer file');
    });
};

var parseQuestions = () => {
  fs.createReadStream(path.resolve(__dirname, 'legacyData', 'questions.csv'))
  // fs.createReadStream(path.resolve(__dirname, 'legacyData', 'test_questions.csv'))
    .pipe(csv({ }))
    .on('data', data => {
      // create model
      var date = parseInt(data.date_written);
      date = new Date(date).toISOString();
      var reported = data.reported;
      if (reported === 1) {
        reported = true;
      } else {
        reported = false;
      }
      const question = new Question({
        'id': data.id,
        'product_id': data.product_id,
        'question_body': data.body,
        'question_date': date,
        'asker_name': data.asker_name,
        'asker_email': data.asker_email,
        'question_helpfulness': data.helpful,
        'reported': reported
      });
        // save to mongo
      question.save((err, answer) => {
        if (err) {
          console.log(err);
        } else {
          console.log(question._id, 'saved');
        }
      });
    })
    .on('end', () => {
      console.log('read csv question file!');
    });
};

