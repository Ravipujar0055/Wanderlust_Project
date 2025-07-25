const joi=require("joi");
const Listing = require("./models/listing");

const listSchema = joi.object({
  listing: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    image: joi.string().allow("", null),
    price: joi.number().required().min(0),
    location: joi.string().required(),
    country: joi.string().required()
  }).required()
});



const reviewschema=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),    
    }).required(),
})

module.exports = {
  listSchema,
  reviewschema
};