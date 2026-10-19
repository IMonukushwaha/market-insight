const  {userJoiSchema, userloginJoiSchema} = require("./JoiSchema.js");
const AppError = require("./utils/ExpressError.js");
const User = require('./models/users.js');
const { getAuthToken, verifyAuthToken } = require('./utils/jwtAuth.js');

module.exports.validateUser = (req, res, next) => {
    const { error } = userJoiSchema.validate(req.body);
    if(error){
        const message = error.details.map((detail) => detail.message).join(', ');
        return next(new AppError(400, message));
    }
    if (Buffer.byteLength(req.body.password, 'utf8') > 72) {
        return next(new AppError(400, 'Password cannot exceed 72 UTF-8 bytes'));
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

module.exports.requireAuth = async (req, res, next) => {
    const token = getAuthToken(req);
    if (!token) {
        return next(new AppError(401, 'Not authenticated'));
    }

    let payload;
    try {
        payload = verifyAuthToken(token);
    } catch (error) {
        if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name)) {
            return next(new AppError(401, 'Not authenticated'));
        }
        return next(error);
    }

    try {
        const user = await User.findById(payload.sub).select('_id username email');
        if (!user) {
            return next(new AppError(401, 'Not authenticated'));
        }

        req.user = user;
        return next();
    } catch (error) {
        return next(error);
    }
}

