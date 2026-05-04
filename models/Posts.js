const mongoose = require('mongoose')
const autoIncrement = require("mongoose-sequence")(mongoose);

const postSchema = mongoose.Schema({
    post_id:{
        type:Number
    },
    title:{
        type:String,
        require:true,
        min:6,
        max:250
    },
    topics:{
        type:String,
        require:true,
        min:3,
        max:100
    },
    data:{
        type:String,
        require:true,
        min:6,
        max:2048
    },
    status:{
        type:String,
        default:"Live"
    },
    owner:{
        type:String,
        require:true,
        min:6,
        max:32
    },
    likes:{
        type:Number,
        default: 0
    },
    dislikes:{
        type:Number,
        default: 0
    },
    comments:{
        type:Number,
        default: 0
    },
    creation_dt:{
        type:Date,
        default:Date.now
    },
    expiration_dt:{
        type:Date,
        default: function () {
            return new Date(Date.now() + 12 * 60 * 60 * 1000)
        }
    }
})

postSchema.plugin(autoIncrement, { inc_field: "post_id" });

module.exports=mongoose.model('Posts',postSchema,'Posts')