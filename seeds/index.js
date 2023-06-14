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
    for (let i = 0; i < 200; i++) {
        const random=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10
        const camp=new Campground({
            author:'6480b187bce6398b12537b8e',
            location:`${cities[random].city}, ${cities[random].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque, voluptas. Excepturi autem corrupti aspernatur eaque iusto est saepe delectus velit placeat animi. Eius quasi ut porro laudantium laboriosam cumque provident!',
            price,
            geometry:{ type: 'Point', coordinates: [
                    cities[random].longitude,
                    cities[random].latitude,
                ]
            },
            images:[
                {
                    url: 'https://res.cloudinary.com/dvg0eo991/image/upload/v1686382431/YelpCamp/asegvpdpefswehbsgplq.jpg',
                    filename: 'YelpCamp/asegvpdpefswehbsgplq',
                  },
                  {
                    url: 'https://res.cloudinary.com/dvg0eo991/image/upload/v1686382433/YelpCamp/yzmrkgv24rr83lgjvvdf.jpg',
                    filename: 'YelpCamp/yzmrkgv24rr83lgjvvdf',
                  }
            ]
        })
        await camp.save();
    }
}
seedDb().then(()=>{
    mongoose.connection.close();
    console.log('Data Saved!! closing')
})