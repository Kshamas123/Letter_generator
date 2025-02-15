// Function to format the date to DD-MM-YYYY format

function goToDashboard() {
  window.location.href = "userdashboard.html";
}
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit day
  return `${day}-${month}-${year}`;
}

// Function to fetch letter data from the backend
async function fetchLetterData() {
  try {
    const userId = sessionStorage.getItem('userId'); // Get userId from sessionStorage
    const letterId = sessionStorage.getItem('letterId'); // Get letterId from sessionStorage

    if (!userId || !letterId) {
      throw new Error('Missing userId or letterId in sessionStorage');
    }

    // Combine userId and letterId into a single token-like format
    const token = `UserID:${userId},LetterID:${letterId}`;

    const response = await fetch('http://localhost:3000/get-invitation-letter', {
      method: 'GET',
      credentials: 'include', // Allow cookies/session data
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${btoa(token)}`, // Base64-encoded Authorization token
      },
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
    document.getElementById('finalEventDate').textContent = formatDate(letterData.EVENTDATE); // Format event date
    document.getElementById('finalEventVenue').textContent = letterData.EVENTVENUE;
    document.getElementById('finalSenderName').textContent = letterData.SENDERNAME;
  } catch (error) {
    console.error('Error fetching letter data:', error);
  }
}



// Function to generate the PDF
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Set fonts and styles
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);

  // Define margins and spacing
  const marginX = 20;
  const marginY = 25;
  let currentY = marginY;

  // Letter heading
  doc.text("Invitation Letter", doc.internal.pageSize.width / 2, currentY, { align: "center" });
  currentY += 10;

  // Sender's address and date
  doc.setFontSize(12);
  doc.text(`Sender's Address:`, marginX, currentY);
  doc.text(document.getElementById('finalSenderAddress').textContent, marginX, currentY + 5);
  currentY += 20;

  doc.text(`Date: ${document.getElementById('finalLetterDate').textContent}`, marginX, currentY);
  currentY += 20;

  // Salutation
  const receiverName = document.getElementById('finalReceiverName').textContent;
  doc.text(`Dear ${receiverName},`, marginX, currentY);
  currentY += 15;

  // Letter body content
  const eventType = document.getElementById('finalEventType').textContent;
  const eventDate = document.getElementById('finalEventDate').textContent;
  const eventVenue = document.getElementById('finalEventVenue').textContent;

  const bodyText = [
    `I'm writing to invite you to a special occasion! We are hosting a ${eventType} on`,
    `${eventDate} at ${eventVenue}. It would mean so much to us if you could join and`,
    `make the event memorable with your presence.`,
    ``,
    `Please let me know if you'll be able to come!`,
    `Looking forward to seeing you.`,
  ];

  doc.setLineHeightFactor(1.5); // Adjust line spacing for better readability
  bodyText.forEach((line) => {
    doc.text(line, marginX, currentY);
    currentY += 7;
  });

  // Closing statement and sender's name
  const senderName = document.getElementById('finalSenderName').textContent;
  currentY += 15;
  doc.text("Yours sincerely,", marginX, currentY);
  currentY += 10;
  doc.text(senderName, marginX, currentY);

  // Save the PDF as a file
  doc.save("Invitation_Letter.pdf");
}

// Fetch the letter data when the page loads
window.onload = fetchLetterData;

// Add event listener for the download button
document.getElementById('downloadPDFButton').addEventListener('click', generatePDF);
