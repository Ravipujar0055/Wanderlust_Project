
const mongoose=require("mongoose");
const review = require("./review");
const { types } = require("joi");
const path = require("path");
const Schema=mongoose.Schema;//schema class it can create multiple schemas

const listSchema=new Schema({   //schema
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: { 
        url:String,
        filename:String,
},
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:
    {
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});
listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in :listing.reviews}})
    }
})
const Listing=mongoose.model("Listing",listSchema);//model
module.exports=Listing;