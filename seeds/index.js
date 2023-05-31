const mongoose=require('mongoose')
const Campground=require('../models/campgrounds.js')
const cities = require('./cities.js')
const {places,descriptors}=require('./seedHelpers.js')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
        .then(()=>{
            console.log("Mongoose Connected Successfully")
        })
        .catch(err =>{
            console.log(err.message)
        })
const sample =array=>array[Math.floor(Math.random()*array.length)];

const seedDb =async()=>{
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random=Math.floor(Math.random()*1000);
        const camp=new Campground({
            location:`${cities[random].city}, ${cities[random].state}`,
            title:`${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}
seedDb().then(()=>{
    mongoose.connection.close();
})