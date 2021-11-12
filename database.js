const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/atelier', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb+srv://surekha:lavi@71.83.128.153/atelier', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected!');
});

module.exports = { db };