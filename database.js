const mongoose = require('mongoose');
const { username, password } = require('./.config');

// mongoose.connect('mongodb://localhost:27017/atelier', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(`mongodb://${username}:${password}@ip-172-31-38-155.us-east-2.compute.internal:27017/atelier`, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected!');
});

module.exports = { db };