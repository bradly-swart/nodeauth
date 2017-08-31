var bcrypt = require('bcryptjs');
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/nodeauth')

var db = mongoose.connection

var UserSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    profilePic: {
        type: String
    }
})

var User = module.exports = mongoose.model('User', UserSchema)

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            newUser.password = hash
            newUser.save(callback)
        })
    })
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback)
}

module.exports.getUserByEmail = function(email, callback){
    var query = {email: email}
    User.findOne(query, callback)
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        callback(null, isMatch)
    })
}