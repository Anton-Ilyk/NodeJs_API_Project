const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        max:32
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:148
    },
    firstName:{
        type:String,
        require:true,
        min:3,
        max:24
    },
    lastName:{
        type:String,
        require:true,
        min:3,
        max:24
    },
    prefferedTopic:{
        type:String
    },
    creation_dt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Users',userSchema,'Users')