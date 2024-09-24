module.exports = (errorFun)=>{
    return (req,res,next)=>{
        errorFun(req,res,next).catch(next);
    }
}




