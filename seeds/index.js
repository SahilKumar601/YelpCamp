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
        const price=Math.floor(Math.random()*20)+10
        const camp=new Campground({
            author:'6480b187bce6398b12537b8e',
            location:`${cities[random].city}, ${cities[random].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque, voluptas. Excepturi autem corrupti aspernatur eaque iusto est saepe delectus velit placeat animi. Eius quasi ut porro laudantium laboriosam cumque provident!',
            price
        })
        await camp.save();
    }
}
seedDb().then(()=>{
    mongoose.connection.close();
    console.log('Data Saved!! closing')
})