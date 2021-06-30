/* const express = require('express');
const path = require('path'); */
const mongoose = require('mongoose');
//here '..' mention that campgroundd in one folder seeds index is in another folder
const Campground = require('../models/campground');
const {descriptors,places} = require('./seedhelpers');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error"));
db.once("open",() => {
    console.log("DB OPEN");
});

const sample = array =>array[Math.floor(Math.random()* array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    for( let i = 0; i < 300; i++ ){
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author : '60d5b134e221032de0968a42',
            location : `${cities[rand1000].city},${cities[rand1000].state}`,
            name : `${sample(descriptors)} ${sample(places)}`,
            /* image : 'https://source.unsplash.com/collection/190727/500x500', */
            describtion : 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora, consequuntur qui! Accusantium, labore? Consectetur natus perferendis vel? Deserunt, sapiente hic iste, numquam voluptatibus deleniti beatae harum facilis nostrum ab quos?',
            price,
            geometry: { //geometry.path required
                type: "Point",
                coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude
                ]
            },
            images :  [
                {
                 
                  url: 'https://res.cloudinary.com/appinessyelpcamp/image/upload/v1624780593/YelpCamp/ribjkwcc1derijtlbaye.jpg',
                  filename: 'YelpCamp/ribjkwcc1derijtlbaye'
                }
              
              ]
        })
        await camp.save();

    }
    
}

seedDB().then(() => {
    mongoose.connection.close();
})