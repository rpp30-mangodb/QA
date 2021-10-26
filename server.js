const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./database');
const Question = require('./models/questionModel');
const Answer = require('./models/answerModel');

const PORT = 5000;
const app = express();

app.use(cors());
app.listen(PORT, function () {
  console.log(`CORS-enabled web server listening on port ${PORT}`);
});

// get all questions and answers for particular product id
app.get('/qa/questions/:product_id&:page&:count', (req, res)=> {
  const productId = req.params.product_id;
  const page = req.params.page;
  const count = req.params.count;
  console.log('product id', productId);
  console.log('page', page);
  console.log('count', count);
  if (productId === undefined || page === undefined || count === undefined) {
    res.statusCode(400).res.send('please input appropriate parameteres');
  } else if (typeof productId !== 'number' || typeof page !== 'number' || typeof count !== 'number') {
    res.statusCode(400).res.send('please input appropriate parameteres');
  } else {
    let response = {'product_id': productId};
    // filter out the reported questions
    let questionResults = Question.find({product_id: productId}, 'question_id question_body question_date asker_name question_hepfulness reported')
      .toArray((err, docs) => {
        if (err) {
          console.log(err);
        } else {
          console.log('success questions');
        }
      });
    for (var i = 0; i < questionResults.length; i++) {
      // filter out the reported answers
      const answers = Answer.findOne({question_id: questionResults[i].question_id});
      console.log('answers', answers);
      questionResults[i].answers = answers;
      console.log('question results', questionResults);
    }
    response.results = questionResults;
    res.statusCode(200).send(response);
  }
});

// add a question
app.post('/qa/questions', (req, res) => {
  console.log(req.body);
  const productId = req.body.product_id;
  const body = req.body.body;
  const name = req.body.name;
  const email = req.body.email;
  if (productId === undefined || body === undefined || name === undefined || email === undefined || productId === undefined) {
    res.statusCode(400).send('please send appropriate inputs');
  } else if (typeof productId !== 'number' || typeof body !== 'string' || typeof name !== 'string' || typeof email !== 'string' || productId !== 'number') {
    res.statusCode(400).send('please send appropriate inputs');
  } else {
    Question.save({
      // 'question_id': , get last id
      'product_id': productId,
      'question_body': body,
      // 'question_date': get current date
      'asker_name': name,
      'asker_email': email,
    });
    res.statusCode(201).res.send('question added');
  }
});

// get all answers for a particular question id
app.get('/qa/questions/:question_id/answers', (req, res) => {
  console.log('body', req.body);
  console.log('params', req.params);
  console.log('query', req.query);
  const questionId = req.params.question_id;
  const page = req.query.page;
  const count = req.query.count;
  res.statusCode(200).res.send(answers);
});

// add an answer for a particular question id
app.post('/qa/questions/:question_id/answers', (req, res) => {
  console.log('body', req.body);
  consoe.log('params', req.params);
  const questionId = req.params.question_id;
  const body = req.params.body;
  const name = req.params.name;
  const email = req.params.email;
  const photos;
  if (req.params.photos) {
    photos = req.params.photos; // sent as array?
  } else {
    photos = [];
  }
  Answer.save({
    // 'id': find latest id
    'question_id': questionId,
    'body': body,
    // 'date': current date
    'answerer_name': name,
    'answerer_email': email,
    'reported': {type: Boolean, default: false}, // update when it is true
    'photos': photos
  })
  res.statusCode(201).res.send('answer added');
});

// mark question as helpful
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  console.log('body', req.body);
  console.log('params', req.params);
  const questionId = req.params.question_id;
  // increment helpfulness
  // Question.findOneAndUpdate({question_id: questionId}, {$set: {question_helpfulness: }})
  res.statusCode(204).end();
});

// mark question as reported
app.put('/qa/questions/:question_id/report', (req, res) => {
  console.log('body', req.body);
  console.log('params', req.params);
  const questionId = req.params.question_id;
  // mark reported as true
  // Question.findOneAndUpdate({question_id: questionId}, {$set: {reported: true}});
  res.statusCode(204).end();
});

// mark answer as helpful
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  console.log('body', req.body);
  console.log('params', req.params);
  const answerId = req.params.answer_id;
  // increment helpfulness
  // Answer.findOneAndUpdate({id: answerId}, {$set: {helpfulness: }});
  res.statusCode(204).end();
});

// mark answer as reported
app.put('/qa/answers/:answer_id/report', (req, res) => {
  console.log('body', req.body);
  console.log('params', req.params);
  const answerId = req.params.answer_id;
  // mark reported as true
  // Answer.findOneAndUpdate({id: answerId}, {$set: {reported: true}});
  res.statusCode(204).end();
});