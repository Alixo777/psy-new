
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

      const email = document.querySelector('[type=email]').value;
      const password = document.querySelector('[type=password]').value;
      const id = document.querySelector('[type=id]').value;
      const firstName = document.querySelector('[type=firstName]').value;
      const lastName = document.querySelector('[type=lastName]').value;
      const age = document.querySelector('[type=age]').value;
      const address = document.querySelector('[type=address]').value;
      const phoneNumber = document.querySelector('[type=phoneNumber]').value;
    
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
    
      const raw = JSON.stringify({
        email,
        password,
        id,
        firstName,
        lastName,
        age,
        address,
        phoneNumber

      });
    
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
    
      fetch("/api/patients/register", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            alert("הרשמה בוצעה בהצלחה");
            window.location.href = "/login.html";
          } else {
            alert("שגיאה בהרשמה");
          }
        })
        .catch((error) => console.error(error));

});
    
//     const email = document.getElementById('email').value;

//     fetch('/api/patients/register', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email: email })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('הרשמה בוצעה בהצלחה:', data);
//         alert('תודה על ההרשמה! תוכל לקבל התראות במייל.');
//     })
//     .catch(error => {
//         console.error('שגיאה בהרשמה:', error);
//         alert('נראה שיש בעיה בהרשמה, נסה שוב מאוחר יותר.');
//     });

    
// });