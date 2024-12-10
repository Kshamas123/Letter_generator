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
  document.getElementById('name').value="";
  document.getElementById('password').value="";
  document.getElementById('email').value="";
  const response = await fetch('http://localhost:3000/sign_up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', 
    body: JSON.stringify({
        Name: name,
        Password:password,
        Email:email
    }),
    
});
const result = await response.json();
if (response.ok) {
    sessionStorage.setItem('userId', result.userId);
    alert("ACCOUNT CREATED SUCCESSFULLY");
    window.location.href = "lettertypes.html";
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
  document.getElementById('name1').value="";
  document.getElementById('password1').value="";
  const response = await fetch('http://localhost:3000/sign_in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', 
    body: JSON.stringify({
        Name: name,
        Password:password
    }),  
});
const result = await response.json();
if (response.ok) {
  sessionStorage.setItem('userId', result.userId);
  alert(result.message);
  window.location.href = "lettertypes.html";
} else {
  alert('Error: ' + result.error);
}
     
}
)