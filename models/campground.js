const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


//for thumnails image
const ImageSchema =new Schema({
            url:String,
            filename : String
});

ImageSchema.virtual('thumbnail').get(function() { 
    return this.url.replace('/upload','/upload/w_200');
});
//mongoose doesn't include virtuals when you convert a document to JSON so we use toJSON
const opts = {toJSON:{ virtuals:true}};

const CampgroundSchema = new Schema({
    name : String,
    images : [
        ImageSchema
       /*  {
            url:String,
            filename : String
        } */
    ],
    geometry:{
        type:{
            type:String,        //don't do '{location : {type:String}}' 
            enum: ['Point'],        //'location.type must be point
           required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price : Number,
    describtion : String,
    location : String,
    author : {
        type : Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
},opts);

//each cluster popup text.so we add properties field to the schema
CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/campground/${this._id}">${this.name}</a></strong>
    <p>${this.describtion.substring(0,20)}...</p>`
});

//deleting reviews with campground
//it's helps to delete campground inside array of reviews deleted too
//mongoose middleware used here....we can use 'deleteMany' instead of 'remove'
CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.remove({
            _id:{
                $in : doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema);



















