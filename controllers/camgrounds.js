const Campground=require('../models/campgrounds.js')
const {cloudinary}=require('../cloudinary')
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxtoken=process.env.MAP_BOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapboxtoken}); 

module.exports.index=async (req, res) => {
    const camps = await Campground.find({});
    res.render("campgrounds/index.ejs", { camps });
}
module.exports.renderNewForm=(req, res) => {
    res.render("campgrounds/new.ejs");
}
module.exports.newCamp=async (req, res,next) => {
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
    const camp = new Campground(req.body.campground);
    camp.geometry=geoData.body.features[0].geometry;
    camp.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    camp.author=req.user._id;
    await camp.save();
    req.flash('success','Campground Added!!!!');
    res.redirect(`/campgrounds/${camp._id}`);
}
module.exports.showPage=async (req, res,next) => {
    const { id } = req.params;
    const foundCamp = await Campground.findById(id).populate({
      path:'review',
      populate:{
        path:'author'
      }
    }).populate('author');
    if (!foundCamp) {
      req.flash('error','Camground Not Found')
      return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show.ejs", { foundCamp });
}
module.exports.renderEditPage=async(req,res,next)=>{
    const {id}=req.params;
    // res.send(id)
    const camp= await Campground.findById(id);
    res.render('campgrounds/edit.ejs',{ camp })
}
module.exports.updateCamp=async(req,res,next)=>{
    const {id}=req.params;
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
    const UpdateCamp=await Campground.findByIdAndUpdate(id,req.body.campground,{new:true})
    UpdateCamp.geometry=geoData.body.features[0].geometry;
    image=req.files.map(f=>({url:f.path,filename:f.filename}));
    UpdateCamp.images.push(...image);
    await UpdateCamp.save();
    if (req.body.deleteImage) {
        for (let filename of req.body.deleteImage) {
            await cloudinary.uploader.destroy(filename);
        }
        await UpdateCamp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImage}}}})
    }
    req.flash('success','Updated Successfully')
    res.redirect(`/campgrounds/${UpdateCamp._id}`)
}
module.exports.deletecamp=async(req,res,next)=>{
    const {id}=req.params
    const delCamp=await Campground.findByIdAndDelete(id);
    req.flash('delete','Campground Deleted!!')
    res.redirect('/campgrounds');
}