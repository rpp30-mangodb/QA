const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
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
  // check if collection exists, if so drop to avoid duplicates
  db.db.listCollections().toArray(function(err, names) {
    if (err) {
      console.log(err);
    } else {
      for (i = 0; i < names.length; i++) {
        console.log(names[i].name);
        if (names[i].name === 'photos') {
          db.db.dropCollection(
            'photos',
            function(err, result) {
              console.log('photos dropped');
            }
          );
        }
        if (names[i].name === 'answers') {
          db.db.dropCollection(
            'answers',
            function(err, result) {
              console.log('answers dropped');
            }
          );
        }
        if (names[i].name === 'questions') {
          db.db.dropCollection(
            'questions',
            function(err, result) {
              console.log('questions dropped');
            }
          );
        }
      }
      parsePhotos();
    }
  });
  // parsePhotos();
  // parseAnswers();
  // parseQuestions();
});

var parsePhotos = () => {
  const photos = [];
  var counter = 0;
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
      photos.push(photo);
    })
    .on('end', async () => {
      console.log(photos.length);
      while (photos.length > 0) {
        var chunk;
        if (photos.length >= 500) {
          chunk = photos.splice(0, 500);
        } else {
          chunk = photos.splice(0, photos.length); // to get remainder
        }
        await Photo.insertMany(chunk);
      }
      console.log('read csv photo file');
      if (photos.length === 0) {
        parseAnswers();
      }
    });
};

var parseAnswers = () => {
  const answers = [];
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
      answers.push(answer);
      if (answers.length >= 500) {
        Answer.insertMany(answers.splice(0, 500));
      }
    })
    .on('end', async () => {
      console.log(answers.length);
      while (answers.length > 0) {
        await Answer.insertMany(answers.splice(0, answers.length));
      }
      console.log('read csv answer file');
      if (answers.length === 0) {
        parseQuestions();
      }
    });
};

var parseQuestions = () => {
  const questions = [];
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
      questions.push(question);
      if (questions.length >= 500) {
        Question.insertMany(questions.splice(0, 500));
      }
    })
    .on('end', async () => {
      console.log(questions.length);
      while (questions.length > 0) {
        await Question.insertMany(questions.splice(0, questions.length));
      }
      console.log('read csv question file!');
    });
};