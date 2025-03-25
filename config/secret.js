require('dotenv').config();

exports.confsecretList = {
    PORT:process.env.PORT,
    TOKEN_SECRET:process.env.JWT_SECRET_KEY,
    USERNAME:process.env.USERNAME,
    PASSWORD:process.env.PASSWORD,
    USER_ID:process.env.USER_ID,
    SERVICE_ID:process.env.SERVICE_ID,
    TEMPLATE_ID:process.env.TEMPLATE_ID
    

}