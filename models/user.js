var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/nodeauth')

var db = mongoose.connection()