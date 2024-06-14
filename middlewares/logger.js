const logger = (req,res,next) =>{
    console.log(`${req.method} ${req.portocol} ${req.get('host')} ${req.originalUrl}`);
    next();
}

module.exports = logger;