const mongoose = require('mongoose')

const schema = mongoose.Schema;

const datamodel = new schema({
    type: {
        type: String,
        required: true
      },
      subject: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      feedback: {
        type: String,
        default:null
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
      user: {
        type: String,
        required: true
      },
      feedbackgiven:{
        type: Boolean,
        default:false,
      }
     
      
})

module.exports = mongoose.model('Data', datamodel);;