const mongoose = require('mongoose');
const passportlocalmongoose=require('passport-local-mongoose')
const schema = mongoose.Schema

const userSchema =new schema({
    email:{
        type:String,
        require:true,
        unique:true
    }

})
userSchema.plugin(passportlocalmongoose) //This Function will be adding a Password Field Automatically

module.exports=mongoose.model('User',userSchema);