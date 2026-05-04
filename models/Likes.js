const mongoose = require('mongoose')

const likesSchema = mongoose.Schema({
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
    action_dt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Likes',likesSchema,'Likes')