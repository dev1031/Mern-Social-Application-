const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    text: {
        type: String,
        required: 'Text is required'
      },
      photo: {
        type: String
      },
      likes: [{
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
      }],
      comments: [{
        text: String,

        created: { 
          type: Date,
          default: Date.now 
        },

        postedBy: { 
          type: mongoose.Schema.ObjectId, 
          ref: 'User'
        }

      }],

      postedBy: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
      },
      
      created: {
        type: Date,
        default: Date.now
      }
})

const Post =  mongoose.model('Post' , PostSchema);

module.exports = Post;