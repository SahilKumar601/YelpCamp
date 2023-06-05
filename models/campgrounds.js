const mongoose =require('mongoose')
const Schema=mongoose.Schema;


const CampgroundSchema=new Schema({
    title:String,
    image:String,
    description:String,
    price:Number,
    location:String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:'review'
        }
    ]
})

module.exports=mongoose.model('Campground',CampgroundSchema);