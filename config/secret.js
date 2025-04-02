require('dotenv').config();

exports.confsecretList = {
    PORT:process.env.PORT,
    TOKEN_SECRET:process.env.JWT_SECRET_KEY,
    USERNAME:process.env.USERNAME,
    PASSWORD:process.env.PASSWORD
    

}