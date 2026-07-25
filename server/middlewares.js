const  {userJoiSchema, userloginJoiSchema} = require("./JoiSchema.js");
const AppError = require("./utils/ExpressError.js");

module.exports.validateUser = (req, res, next) => {
    const { error } = userJoiSchema.validate(req.body);
    if(error){
        const message = error.details.map((detail) => detail.message).join(', ');
        return next(new AppError(400, message));
    }
    next();
}

module.exports.validatelogin = (req, res, next) => {
    const { error } = userloginJoiSchema.validate(req.body);
    if(error){
        const message = error.details.map((detail) => detail.message).join(', ');
        return next(new AppError(400, message));
    }
    next();
}

module.exports.requireAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next(new AppError(401, 'Not authenticated'));
    }
    next();
}

