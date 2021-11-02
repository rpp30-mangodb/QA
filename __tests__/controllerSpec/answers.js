/* eslint-disable camelcase */
const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const should = chai.should();
const Answer = require('../../models/answerModel');
const answers = require('../../controllers/answersController');

chai.use(chaiAsPromised);

describe('answers test suite', function() {
  afterAll(done => {
    try {
      Promise.resolve(Answer.findOneAndUpdate({id: 409068}, {$set: {reported: false}}));
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should get a list of answers', done => {
    try {
      expect(Promise.resolve(answers.getAnswers(209511))).to.eventually.have.lengthOf(1);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should mark answer as helpful', done => {
    try {
      Promise.resolve(answers.markAnswerHelpful(409068)).should.be.fulfilled;
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should report answer', done => {
    try {
      Promise.resolve(answers.reportAnswer(409068)).should.be.fulfilled;
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe('post answers test', function() {
  const path = __dirname + '/testIds.txt';
  afterAll(done => {
    try {
      Answer.deleteOne({body: 'test'});
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should read ids.txt file', done => {
    try {
      Promise.resolve(answers.readIds(path)).should.be.fulfilled;
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should write ids.txt file', done => {
    const idData = {questionData: 'questions:3518963', answerId: 6879306, photoId: 2063752};
    try {
      expect(Promise.resolve(answers.writeIds(path, {photos: 'https://images.unsplash.com/photo-1500603720222-eb7a1f997356?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1653&q=80'}, idData))).to.eventually.have.property('answerId', 6879306);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should save a new answer', done => {
    const postData = {
      body: 'test',
      name: 'rex',
      email: 'rex@rex.com',
    };
    const ansAndPhotoData = {answerId: 6879307, photoId: 2063752};
    try {
      expect(Promise.resolve(answers.saveDoc(209511, postData, ansAndPhotoData))).to.eventually.have.property('body', 'test');
      done();
    } catch (err) {
      done(err);
    }
  });
});
