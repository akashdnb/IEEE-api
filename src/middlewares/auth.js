const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const auth = async (req, res, next) => {
    try {
        const bearerToken =  req.header('Authorization') || req.cookies.token;
        if(!bearerToken){
            throw new Error();
        }
        const token = bearerToken.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token});

        if (!admin) {
            throw new Error();
        }

        req.token = token;
        req.admin = admin;
        next();
    } catch (err) {
        if(err.message === 'jwt expired'){
            req.cookies = NULL;
            return res.status(401).json({ message: 'Please authenticate', error: err });
        }else{
            res.status(401).json({ message: 'Please authenticate', error: err });
        }  
    }
}

module.exports = {
    auth
}