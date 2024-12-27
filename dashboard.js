document.getElementById("view-analytics").addEventListener("click", function () {
  // Hide the user information section and show the analytics section
  document.getElementById("user-info").style.display = "none";
  document.getElementById("analytics").style.display = "block";

  // Create an iframe to load the Chart.html dynamically
  const chartContainer = document.getElementById("chart");
  const iframe = document.createElement("iframe");
  iframe.src = "Chart.html"; // Specify the chart page to load
  iframe.width = "100%";
  iframe.height = "500px";
  iframe.style.border = "none";

  // Clear existing content in the chart container and append the iframe
  chartContainer.innerHTML = "";
  chartContainer.appendChild(iframe);
});

document.getElementById("view-users").addEventListener("click", function () {
  // Hide the analytics section and show the user information section
  document.getElementById("analytics").style.display = "none";
  document.getElementById("user-info").style.display = "block";
  
  // Fetch the list of users from the backend
  fetch('/users')
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch users, status: ' + response.status);
          }
          return response.json();
      })
      .then(users => {
          const userList = document.getElementById("user-list");
          userList.innerHTML = ''; // Clear any previous data

          // Populate the user list with data
          if (users.length === 0) {
              userList.innerHTML = '<li>No users found</li>';
          } else {
              users.forEach(user => {
                  const li = document.createElement("li");
                  li.textContent = `${user.USERNAME}`;
                  li.addEventListener("click", () => showUserDetails(user.USERID)); // Show user details on click
                  userList.appendChild(li);
              });
          }
      })
      .catch(error => {
          console.error('Error fetching users:', error);
          const userList = document.getElementById("user-list");
          userList.innerHTML = '<li>Error fetching user list. Please try again later.</li>';
      });
});

// Function to show user details and their letter counts
function showUserDetails(userId) {
  // Fetch user details and letter counts
  fetch(`/user/${userId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch user details, status: ' + response.status);
          }
          return response.json();
      })
      .then(data => {
          const userInteractionDiv = document.getElementById("user-interaction");
          const { user, letter_counts } = data;

          // Check if letter_counts are null or undefined, and set default values
          const invitationCount = letter_counts.invitation_count || 0;
          const birthdayCount = letter_counts.birthday_count || 0;
          const congratulationsCount = letter_counts.congratulations_count || 0;
          const leaveCount = letter_counts.leave_count || 0;

          // Display user details and their letter counts
          userInteractionDiv.innerHTML = `
              <h3>User Details</h3>
              <p><strong>Name:</strong> ${user.USERNAME}</p>
              <p><strong>Email:</strong> ${user.USEREMAIL}</p> <!-- Ensure this matches your API response -->
              <h4>Letter Counts</h4>
              <p><strong>Invitation Letters:</strong> ${invitationCount}</p>
              <p><strong>Birthday Wishes:</strong> ${birthdayCount}</p>
              <p><strong>Congratulations Letters:</strong> ${congratulationsCount}</p>
              <p><strong>Leave Letters:</strong> ${leaveCount}</p>
          `;
      })
      .catch(error => {
          console.error('Error fetching user details:', error);
          const userInteractionDiv = document.getElementById("user-interaction");
          userInteractionDiv.innerHTML = '<p>Error fetching user details. Please try again later.</p>';
      });
}
