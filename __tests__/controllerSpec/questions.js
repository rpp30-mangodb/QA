/* eslint-disable camelcase */
const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const should = chai.should();
const Question = require('../../models/questionModel');
const questions = require('../../controllers/questionsController');

chai.use(chaiAsPromised);

describe('questions test suite', function() {
  afterAll(done => {
    try {
      Promise.resolve(Question.findOneAndUpdate({question_id: 209511}, {$set: {reported: false}}));
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should get a list of questions', done => {
    try {
      expect(Promise.resolve(questions.getQuestions(59553))).to.eventually.have.lengthOf(1);
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should mark question as helpful', done => {
    try {
      Promise.resolve(questions.markQuestionHelpful(209511)).should.be.fulfilled;
      done();
    } catch (err) {
      done(err);
    }
  });

  it('should report question', done => {
    try {
      Promise.resolve(questions.reportQuestion(209511)).should.be.fulfilled;
      done();
    } catch (err) {
      done(err);
    }
  });

  describe('post questions test suite', function() {
    const path = __dirname + '/testIds.txt';
    afterAll(done => {
      try {
        Question.deleteOne({question_body: 'test'});
        done();
      } catch (err) {
        done(err);
      }
    });

    it('should read ids.txt file', done => {
      try {
        Promise.resolve(questions.readIds(path)).should.be.fulfilled;
        done();
      } catch (err) {
        done(err);
      }
    });

    it('should write ids.txt file', done => {
      const questionId = 3518963;
      const dataIds = ['answers:6879306', 'photos:2063752'];
      try {
        Promise.resolve(questions.writeIds(path, {questionId, dataIds})).should.be.fulfilled;
        done();
      } catch (err) {
        done(err);
      }
    });

    it('should save a new question document', done => {
      const questionId = 3518964;
      const postData = {
        product_id: 59553,
        body: 'test',
        name: 'rex',
        email: 'rex@rex.com'
      };
      try {
        expect(Promise.resolve(questions.saveDoc(postData, questionId))).to.eventually.have.property('question_body', 'test');
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
