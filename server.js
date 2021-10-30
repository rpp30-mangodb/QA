/* eslint-disable camelcase */
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./database');
const Question = require('./models/questionModel');
const Answer = require('./models/answerModel');
const questions = require('./controllers/questionsController');
const answers = require('./controllers/answersController');

const PORT = 5000;
const app = express();

app.use(cors());
app.listen(PORT, function () {
  console.log(`CORS-enabled web server listening on port ${PORT}`);
});

// get all questions and answers for particular product id
app.get('/qa/questions', (req, res)=> {
  console.log('get questions hit');
  console.log('query', req.query);
  const { product_id, page, count } = req.query;
  console.log('product id', product_id, 'page', page, 'count', count);
  if (product_id === undefined || page === undefined || count === undefined) {
    console.log('first get questions if');
    res.status(400).res.send('please input appropriate parameters');
  } else if (!Number.isInteger(parseInt(product_id)) || !Number.isInteger(parseInt(page)) || !Number.isInteger(parseInt(count))) {
    console.log('second get questions if');
    console.log(typeof product_id, typeof page, typeof count);
    res.status(400).res.send('please input appropriate parameters');
  } else {
    console.log('inside get questions else block');
    let response = {product_id: product_id, results: null};
    questions.getQuestions(product_id)
      .then(questions => {
        console.log('questions', questions);
        response.results = questions;
        // filter out the reported answers
        return Promise.all(questions.map(doc => {
          return answers.getAnswers(doc.question_id);
        }))
          .then(answers => {
            console.log('answers', answers);
            for (var i = 0; i < response.results.length; i++) {
              response.results[i].answers = {};
              for (var j = 0; j < answers.length; j++) {
                if (response.results[i].question_id === answers[j].questionId) {
                  response.results[i].answers[parseInt(answers[j].answers.id)] = answers[j].answers;
                }
              }
            }
            console.log('get questions response', response);
            console.log('sample qet questions answer object', response.results[0].answers);
            res.status(200).send(response);
          })
          .catch(err => {
            console.log(err);
            res.end();
          });
      });
  }
});

// add a question
app.post('/qa/questions', (req, res) => {
  console.log('post question hit');
  console.log(req.body);
  const productId = req.body.product_id;
  const body = req.body.body;
  const name = req.body.name;
  const email = req.body.email;
  if (productId === undefined || body === undefined || name === undefined || email === undefined || productId === undefined) {
    res.status(400).send('please send appropriate inputs');
  } else if (typeof productId !== 'number' || typeof body !== 'string' || typeof name !== 'string' || typeof email !== 'string' || productId !== 'number') {
    res.status(400).send('please send appropriate inputs');
  } else {
    Question.save({
      // question_id: , get last id
      product_id: productId,
      question_body: body,
      // question_date: get current date
      asker_name: name,
      asker_email: email,
    });
    res.status(201).send('question added');
  }
});

// get all answers for a particular question id
app.get('/qa/questions/:question_id/answers', (req, res) => {
  console.log('hit get answers');
  console.log('params', req.params); // question_id
  console.log('query', req.query); // page: 1, count: 100
  const questionId = req.params.question_id;
  const { page, count } = req.query;
  let response = {question: questionId, page: parseInt(page), count: parseInt(count), results: []};
  return answers.getAnswers(questionId)
    .then(answers => {
      console.log(answers);
      var copyAnswers = {...answers.answers._doc};
      console.log('copy', copyAnswers);
      copyAnswers['answer_id'] = copyAnswers.id;
      delete copyAnswers.id;
      console.log('post delete copy', copyAnswers);
      response.results.push(copyAnswers);
      res.status(200).send(response);
    })
    .catch(err => {
      console.log(err);
      res.end();
    });
});

// add an answer for a particular question id
app.post('/qa/questions/:question_id/answers', (req, res) => {
  console.log('post answer');
  console.log('body', req.body);
  consoe.log('params', req.params);
  const questionId = req.params.question_id;
  const body = req.params.body;
  const name = req.params.name;
  const email = req.params.email;
  const photos = [];
  if (req.params.photos) {
    photos = req.params.photos; // sent as array?
  }
  Answer.save({
    // 'id': find latest id
    question_id: questionId,
    body: body,
    // 'date': current date
    answerer_name: name,
    answerer_email: email,
    reported: {type: Boolean, default: false}, // update when it is true
    photos: photos
  });
  res.status(201).res.send('answer added');
});

// mark question as helpful
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  console.log('helpful question');
  console.log('body', req.body);
  console.log('params', req.params);
  const questionId = req.params.question_id;
  // increment helpfulness
  // Question.findOneAndUpdate({question_id: questionId}, {$set: {question_helpfulness: }})
  res.status(204).end();
});

// mark question as reported
app.put('/qa/questions/:question_id/report', (req, res) => {
  console.log('reported question');
  console.log('body', req.body);
  console.log('params', req.params);
  const questionId = req.params.question_id;
  // mark reported as true
  Question.findOneAndUpdate({question_id: questionId}, {$set: {reported: true}});
  res.status(204).end();
});

// mark answer as helpful
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  console.log('helpful answer');
  console.log('body', req.body);
  console.log('params', req.params);
  const answerId = req.params.answer_id;
  // increment helpfulness
  // Answer.findOneAndUpdate({id: answerId}, {$set: {helpfulness: }});
  res.status(204).end();
});

// mark answer as reported
app.put('/qa/answers/:answer_id/report', (req, res) => {
  console.log('reported answer');
  console.log('body', req.body);
  console.log('params', req.params);
  const answerId = req.params.answer_id;
  // mark reported as true
  Answer.findOneAndUpdate({id: answerId}, {$set: {reported: true}});
  res.status(204).end();
});