
// wrapAsync is Only for async function not normal
module.exports = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
}