const mongoose =require('mongoose')
const Schema=mongoose.Schema;
const Review=require('./review.js')


const CampgroundSchema=new Schema({
    title:String,
    images:[
        {
            url:String,
            filename:String
        }
    ],
    description:String,
    price:Number,
    location:String,
    author:
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        },
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