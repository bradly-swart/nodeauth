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
    newUser.save(callback)
}