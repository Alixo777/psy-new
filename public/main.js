const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("form Login");
  const email = document.querySelector('[type=email]').value;
  const password = document.querySelector('[type=password]').value;
  console.log(email, password);
  fchar = email[0];
  console.log(fchar);
  localStorage.setItem("fchar", fchar);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    email,
    password,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("/api/patients/login", requestOptions)
    .then((response) => {
      if (response.status === 200) {
        alert("התחברות בוצעה בהצלחה");
        let data = response.json()
        .then((data) => {
          console.log(data);
          localStorage.setItem("token", data.token);
          window.location.href = "/home.html";
        });
      } else {
        alert("שגיאה בהתחברות");
      }
    })
    // .catch((error) => console.error(error));
});

// // Send an email notification
// function sendEmailNotification(userEmail) {
//   emailjs.init(process.env.USER_ID); // Replace with your EmailJS user ID

//   const emailParams = {
//     to_email: userEmail,
//     subject: "Login Successful",
//     message: "You have successfully logged in!",
//   };

//   emailjs
//     .send(process.env.SERVICE_ID, process.env.TEMPLATE_ID, emailParams) // Replace with your service ID and template ID
//     .then(
//       (response) => {
//         console.log("Email sent successfully", response);
//       },
//       (error) => {
//         console.error("Error sending email", error);
//       }
//     );
// }
