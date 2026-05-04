const mongoose = require('mongoose')

const commentsSchema = mongoose.Schema({
    post_id:{
        type:Number,
        require:true
    },
    username:{
        type:String,
        require:true,
        min:6,
        max:24
    },
    comment:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    action_dt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Comments',commentsSchema,'Comments')