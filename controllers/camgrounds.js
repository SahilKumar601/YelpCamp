const Campground=require('../models/campgrounds.js')

module.exports.index=async (req, res) => {
    const camps = await Campground.find({});
    res.render("campgrounds/index.ejs", { camps });
}
module.exports.renderNewForm=(req, res) => {
    res.render("campgrounds/new.ejs");
}
module.exports.newCamp=async (req, res,next) => {
    const camp = new Campground(req.body.campground);
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
    const UpdateCamp=await Campground.findByIdAndUpdate(id,req.body.campground,{new:true})
    req.flash('success','Updated Successfully')
    res.redirect(`/campgrounds/${UpdateCamp._id}`)
}
module.exports.deletecamp=async(req,res,next)=>{
    const {id}=req.params
    const delCamp=await Campground.findByIdAndDelete(id);
    req.flash('delete','Campground Deleted!!')
    res.redirect('/campgrounds');
}