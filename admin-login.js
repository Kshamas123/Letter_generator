// Handle admin login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission to handle via JavaScript

    // Get form input values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Simple client-side validation
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
    
        // Log the response text to see what is being returned
        const responseText = await response.text();
        console.log('Response Text:', responseText); // Log the raw response
    
        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
            try {
                const result = JSON.parse(responseText);
                alert(result.error || 'Login failed. Please check your credentials and try again.');
            } catch (err) {
                console.error('Error parsing JSON response:', err);
                alert('Unexpected error: ' + responseText);
            }
            return;
        }
    
        // Parse the response from the backend
        const result = JSON.parse(responseText);
    
        if (result.message) {
            // If login is successful, alert the message and redirect to the dashboard
            alert(result.message);
            window.location.href = 'Dashboard.html'; // Update with your dashboard URL
        } else {
            // Handle unexpected server response
            alert('Login successful, but no message returned from the server.');
        }
    } catch (error) {
        // Catch any unexpected errors during the fetch process
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
    }
    
    
});
