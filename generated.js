// Function to format the date to YYYY-MM-DD format
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding leading zero if necessary
    const day = String(date.getDate()).padStart(2, '0'); // Adding leading zero if necessary
    return `${day}-${month}-${year}`;
  }
  
  // Function to fetch letter data from the backend
  async function fetchLetterData() {
    try {
      const response = await fetch('http://localhost:3000/get-invitation-letter', {
        method: 'GET',
        credentials: 'include' // Allow cookies (session) to be sent with the request
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch letter data');
      }
  
      const letterData = await response.json();
  
      // Populate the preview with fetched data
      document.getElementById('finalSenderAddress').textContent = letterData.SENDERADDRESS;
      document.getElementById('finalLetterDate').textContent = formatDate(letterData.LETTER_DATE);
      document.getElementById('finalReceiverName').textContent = letterData.RECEIVERNAME;
      document.getElementById('finalEventType').textContent = letterData.EVENTTYPE;
      document.getElementById('finalEventDate').textContent = formatDate(letterData.EVENTDATE); // Format the event date
      document.getElementById('finalEventVenue').textContent = letterData.EVENTVENUE;
      document.getElementById('finalSenderName').textContent = letterData.SENDERNAME;
  
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Fetch the letter data when the page loads
  window.onload = fetchLetterData;
  