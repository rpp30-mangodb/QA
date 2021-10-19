const mongoose = require('mongoose');
const question = require('./questionModel');

const { Schema } = mongoose;

const productQASchema = new Schema({
  'product_id': {type: Number, required: true},
  'results': [questionSchema] // will need to update results whenever we get question -> resultSchema.results.push(questionSchema);
});

const productQA = mongoose.model('ProductQA', resultSchema);
// productQA.results.push(question); move to controller?

module.exports = { productQA };