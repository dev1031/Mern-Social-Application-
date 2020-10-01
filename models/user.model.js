const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name :{
        type:String,
        trim : true,
        required :"Name is required"
    },

    email:{
        type:String,
        trim : true,
        unique : 'Email already exists',
        match : [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/],
        required : 'Email is required'
    },

    created :{
        type:Date,
        default:Date.now
    },

    updated:{
        type:Date,
        default:Date.now
    },

    password :{
        type: String,
        required :'Password is required'
    },

    about :{
        type: String,
        trim :true
    },
    photo:{
        type: String
    },
    following: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
    }]
})

const User =  mongoose.model('User' , UserSchema);

module.exports = User;