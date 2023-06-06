const mongoose =require('mongoose')
const Schema=mongoose.Schema;
const Review=require('./review.js')


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
CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.review
            }
        })
    }
})
module.exports=mongoose.model('Campground',CampgroundSchema);