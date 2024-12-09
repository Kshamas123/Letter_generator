const container = document.getElementById("container");
const registerbtn = document.getElementById("register");
const loginbtn = document.getElementById("login");

registerbtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginbtn.addEventListener("click", () => {
  container.classList.remove("active");
});

document.getElementById('signupform').addEventListener('submit', async(e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value;
  console.log(name);
  console.log(password);
  console.log(email)
  const response = await fetch('http://localhost:3000/sign_up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        Name: name,
        Password:password,
        Email:email
    }),
    
});
const result = await response.json();
if (response.ok) {
    alert("ACCOUNT CREATED SUCCESSFULLY");
    window.location.href = "template.html";
} else {
    alert('Error : ' + result.error);
}
      
}
)

document.getElementById('signinform').addEventListener('submit', async(e) => {
  e.preventDefault();
  const name = document.getElementById('name1').value;
  const password = document.getElementById('password1').value;
  console.log(name);
  console.log(password);
  const response = await fetch('http://localhost:3000/sign_in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        Name: name,
        Password:password
    }),  
});
const result = await response.json();
if (response.ok) {
    alert("LOGGED IN SUCCESSFULLY");
    window.location.href = "template.html";
} else {
    alert('Error : ' + result.error);
}
      
}
)