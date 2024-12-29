document.addEventListener("DOMContentLoaded", function () {
    // Fetch total letter count from the backend
    fetch('/letters/total')
      .then(response => response.json())
      .then(data => {
        // Update the "Total Letters" card with the response data
        const totalLettersCard = document.querySelector(".dashboard-section .card:first-child p");
        totalLettersCard.textContent = `Total Letters: ${data.total_letters}`;
      })
      .catch(error => {
        console.error('Error fetching total letter count:', error);
        // Handle error and show a message in the card
        const totalLettersCard = document.querySelector(".dashboard-section .card:first-child p");
        totalLettersCard.textContent = 'Error fetching total letters';
      });
  
    // Handle the logout button
    document.getElementById("logout-btn").addEventListener("click", function () {
      alert("You have been logged out!");
      window.location.href = "index.html"; // Redirect to homepage
    });
  });
  