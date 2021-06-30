const BaseJoi = require('joi');

//to avoid html inputs in forms using this api
//its helps to do the function in JOI
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
    type:'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML':'{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags:[],
                    allowedAttributes:{},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }

});
//we use 'extension' to use sanitizeHTML so we use 'extend' here
const Joi = BaseJoi.extend(extension)
//its not mongoose schema
//serverside validation : JOI,client side validation: new and edit
module.exports.campgroundSchema =  Joi.object({
 campground: Joi.object({
     name: Joi.string().required().escapeHTML(),
     price: Joi.number().required().min(1),
     //image : Joi.string().required(),
     location: Joi.string().required().escapeHTML(),
     describtion:Joi.string().required().escapeHTML()
 }).required(),
    deleteImages:Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating : Joi.number().required().min(1).max(5)
    }).required()
});