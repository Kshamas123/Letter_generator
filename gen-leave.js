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
      const letterId = sessionStorage.getItem('leaveletterId'); // Get letterId from sessionStorage
  
      if (!userId || !letterId) {
        throw new Error('Missing userId or letterId in sessionStorage');
      }
  
      // Combine userId and letterId into a single token-like format
      const token = `UserID:${userId},LetterID:${letterId}`;
  
      const response = await fetch('http://localhost:3000/get-leave-letter', {
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
      document.getElementById('finalRecipientName').textContent = letterData.RECIPIENTNAME;
      document.getElementById('finalRecipientDesignation').textContent = letterData.RECIPIENTDESIGNATION;
      document.getElementById('finalOrganizationName').textContent = letterData.ORGANIZATIONNAME;
      document.getElementById('finalOrganizationAddress').textContent = letterData.ORGANIZATIONADDRESS;
      document.getElementById('finalStartDate').textContent = formatDate(letterData.STARTDATE);
      document.getElementById('finalEndDate').textContent = formatDate(letterData.ENDDATE);
      document.getElementById('finalReason').textContent = letterData.REASON;
      document.getElementById('finalSenderName').textContent = letterData.SENDERNAME;
      document.getElementById('finalContactDetails').textContent = letterData.CONTACTDETAILS;
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
    doc.text("Leave Letter", doc.internal.pageSize.width / 2, currentY, { align: "center" });
    currentY += 10;
  
    // Sender's address and date
    doc.setFontSize(12);
    doc.text(`Sender's Address:`, marginX, currentY);
    doc.text(document.getElementById('finalSenderAddress').textContent, marginX, currentY + 5);
    currentY += 20;
  
    doc.text(`Date: ${document.getElementById('finalLetterDate').textContent}`, marginX, currentY);
    currentY += 20;
  
    // Recipient details
    doc.text(`To,`, marginX, currentY);
    currentY += 10;
    doc.text(document.getElementById('finalRecipientName').textContent, marginX, currentY);
    currentY += 7;
    doc.text(document.getElementById('finalRecipientDesignation').textContent, marginX, currentY);
    currentY += 7;
    doc.text(document.getElementById('finalOrganizationName').textContent, marginX, currentY);
    currentY += 7;
    doc.text(document.getElementById('finalOrganizationAddress').textContent, marginX, currentY);
    currentY += 20;
  
    // Subject
    const startDate = document.getElementById('finalStartDate').textContent;
    const endDate = document.getElementById('finalEndDate').textContent;
    doc.text(`Subject: Request for Leave from ${startDate} to ${endDate}`, marginX, currentY);
    currentY += 15;
  
    // Body content
    const reason = document.getElementById('finalReason').textContent;
    const bodyText = [
      `Dear ${document.getElementById('finalRecipientName').textContent},`,
      ``,
      `I am writing to formally request leave from ${startDate} to ${endDate} due to ${reason}.`,
      ``,
      `I have ensured that my responsibilities are up-to-date, and I am happy to assist`,
      `in delegating tasks during my absence to ensure continuity.`,
      ``,
      `Thank you for considering my request. Please let me know if you need further information or documentation.`,
      ``,
    ];
  
    doc.setLineHeightFactor(1.5); // Adjust line spacing for better readability
    bodyText.forEach((line) => {
      doc.text(line, marginX, currentY);
      currentY += 7;
    });
  
    // Closing statement and sender's name
    const senderName = document.getElementById('finalSenderName').textContent;
    currentY += 15;
    doc.text("Sincerely,", marginX, currentY);
    currentY += 10;
    doc.text(senderName, marginX, currentY);
    currentY += 7;
    doc.text(`Contact Details: ${document.getElementById('finalContactDetails').textContent}`, marginX, currentY);
  
    // Save the PDF as a file
    doc.save("Leave_Letter.pdf");
  }
  
  // Fetch the letter data when the page loads
  window.onload = fetchLetterData;
  
  // Add event listener for the download button
  document.getElementById('downloadPDFButton').addEventListener('click', generatePDF);
  