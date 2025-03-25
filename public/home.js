// import {confsecretList} from '../config/secret.js';

// confsecretList = {
//     TOKEN_SECRET:process.env.JWT_SECRET_KEY,
// }

let token = localStorage.getItem(["token"])
console.log(token);
// jwt.verify(token_value, process.env.JWT_SECRET_KEY);
// let t = confsecretList.JWT_SECRET_KEY
// console.log(t);
// 1- needs to check how to verify the tokem in the front side
// 2- after you get the role from the token you can choose how to navigate the user
// (if role === patients){
//     window.open = homepatient.html
// }

