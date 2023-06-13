const mongoose =require('mongoose')
const Schema=mongoose.Schema;
const Review=require('./review.js')

const ImagesSchema=new Schema({
    url:String,
    filename:String
})
ImagesSchema.virtual('thumbnail').get(function (){
    return this.url.replace('/upload','/upload/w_200');
})
const CampgroundSchema=new Schema({
    title:String,
    images:[ImagesSchema],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates: {
            type:[Number],
            required:true
        }
    },
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