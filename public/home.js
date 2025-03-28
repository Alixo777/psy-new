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

let first = localStorage.getItem(["fchar"]);

let profileSpan = document.querySelector('.profile span');

profileSpan.textContent = first.toUpperCase();;  

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container-fluid'); // Updated selector

    container.addEventListener('click', (event) => {
        const targetDiv = event.target.closest('[class*="col-"]'); // Updated to target any column class
        if (targetDiv) {
            const h2 = targetDiv.querySelector('article > h2:first-child');
            if (h2) {
                const examName = h2.innerHTML.trim(); // Use innerHTML of the container name
                localStorage.setItem('examName', examName); // Store examName in localStorage
            }
        }
    });
});

function sendExamNameToBookingAPI() {
    const examName = localStorage.getItem('examName'); // Retrieve examName from localStorage
    if (examName) {
        const formData = {
            exam: 'Sample Exam', // Replace with actual exam data
            therapist: 'Sample Therapist', // Replace with actual therapist data
            date: new Date().toISOString(), // Replace with actual date
            time: '10:00 AM', // Replace with actual time
            examName: examName, // Send examName to the backend
        };

        fetch('/api/result/saveResult', { // Updated endpoint to saveResult
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Save result response:', data);
        })
        .catch(error => {
            console.error('Error sending result data:', error);
        });
    } else {
        console.error('No examName found in localStorage.');
    }
}

// Call the function when needed, e.g., after a button click
document.querySelector('#submitResultButton')?.addEventListener('click', sendExamNameToBookingAPI);

