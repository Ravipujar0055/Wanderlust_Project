const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing = require("../models/listing");

const mong_url="mongodb://127.0.0.1:27017/wanderlust"
main().then((res)=>{
    console.log("connected to mongodb")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(mong_url);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const initDB=async ()=>{
    await Listing.deleteMany({})
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'68765653691eb3b869f33158'}));
    await Listing.insertMany(initdata.data);
    console.log("data has been successfully intialised");
}
initDB();
