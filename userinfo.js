// Show the "User Information" section by default when the page loads
document.getElementById("user-info").style.display = "block";
document.getElementById("analytics").style.display = "none";
document.getElementById("chart").style.display = "none";

// When the "View Users" button is clicked, fetch and display users
document.getElementById("view-users-list").addEventListener("click", function () {
    fetchUsers(); // Fetch and display the list of users when clicked
});

// When the "View Analytics" button is clicked, redirect to chart.html
document.getElementById("view-analytics").addEventListener("click", function () {
    window.location.href = "chart.html"; // Redirect to chart.html
});

// Fetch the list of users and display it
function fetchUsers() {
    fetch('http://localhost:3000/users') // Update URL to backend server port
      .then(response => response.json())
      .then(users => {
        const userListContainer = document.getElementById("user-list-container");
        userListContainer.innerHTML = ''; // Clear previous data

        // Loop through users and create a clickable box for each user
        users.forEach(user => {
          const userBox = document.createElement("div");
          userBox.classList.add("user-box");
          userBox.innerHTML = `
            <h4>${user.USERNAME}</h4>
          
          `;
          userBox.addEventListener("click", () => showUserDetails(user.USERNAME)); // Show details when clicked
          userListContainer.appendChild(userBox);
        });
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        alert('Error fetching users');
      });
}

// Show user details when a user box is clicked
function showUserDetails(username) {
  fetch(`http://localhost:3000/user/${username}`) // Pass the username to the backend
    .then(response => {
      if (!response.ok) {
        throw new Error('User not found or server error');
      }
      return response.json();
    })
    .then(data => {
      const userDetailsContainer = document.getElementById("user-details");
      console.log(data)
      const { user, letter_counts } = data;
      console.log(user)
      console.log(letter_counts[0])
      // Display the user's details
      userDetailsContainer.innerHTML = `
    
        <p><strong>Name:</strong> ${user.USERNAME}</p>
        <p><strong>Email:</strong> ${user.USEREMAIL}</p>
        <h4>Letter Counts</h4>
        <p><strong>Invitation Letters:</strong> ${letter_counts[0].invitation_count}</p>
        <p><strong>Birthday Wishes:</strong> ${letter_counts[0].birthday_count}</p>
        <p><strong>Congratulations Letters:</strong> ${letter_counts[0].congratulations_count}</p>
        <p><strong>Leave Letters:</strong> ${letter_counts[0].leave_count}</p>
        <p><strong>Total Letters:</strong> ${letter_counts[0].total_count}</p?
      `;
    })
    .catch(error => {
      console.error('Error fetching user details:', error);
      alert('Error fetching user details');
    });
}
