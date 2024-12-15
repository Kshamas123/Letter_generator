// Function to format the date to DD-MM-YYYY format
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit day
  return `${day}-${month}-${year}`;
}

// Function to fetch congratulation letter data from the backend
async function fetchCongratulationData() {
  try {
    const response = await fetch('http://localhost:3000/get-congratulations-letter', {
      method: 'GET',
      credentials: 'include', // Allow cookies/session data to be sent
    });

    if (!response.ok) {
      throw new Error('Failed to fetch congratulation letter data');
    }

    const letterData = await response.json();

    // Populate the preview with fetched data
    document.getElementById('finalSenderAddress').textContent = letterData.SENDERADDRESS;
    document.getElementById('finalLetterDate').textContent = formatDate(letterData.LETTER_DATE);
    document.getElementById('finalReceiverName').textContent = letterData.RECEIVERNAME;
    document.getElementById('finalSenderName').textContent = letterData.SENDERNAME;
    document.getElementById('finalReason').textContent = letterData.REASON;
  } catch (error) {
    console.error('Error fetching congratulation letter data:', error);
  }
}

// Function to generate the congratulation letter PDF
function generateCongratulationPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Set fonts and styles
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);

  // Define margins and spacing
  const marginX = 20;
  const rightMargin = 20; // Equal right margin
  const marginY = 25;
  let currentY = marginY;

  // Title: Congratulation Letter (Centered)
  const title = 'Congratulation Letter';
  doc.setFontSize(16);
  doc.text(title, doc.internal.pageSize.width / 2, currentY, { align: "center" });
  currentY += 15;

  // Sender's address and date (left-aligned, with padding)
  doc.setFontSize(12);
  doc.text(`Sender's Address:`, marginX, currentY);
  doc.text(document.getElementById('finalSenderAddress').textContent, marginX, currentY + 5);
  currentY += 20;

  doc.text(`Date: ${document.getElementById('finalLetterDate').textContent}`, marginX, currentY);
  currentY += 20;

  // Salutation (Receiver's Name)
  const receiverName = document.getElementById('finalReceiverName').textContent;
  doc.text(`Dear ${receiverName},`, marginX, currentY);
  currentY += 15;

  // Body content (Congratulation Reason)
  const reason = document.getElementById('finalReason').textContent;
  const bodyText = [
    `Congratulations on ${reason}! This is such a wonderful milestone, and I couldn’t be happier for you.`,
    ``,
    `Your hard work and dedication truly deserve this success. May this achievement open up many more opportunities and bring you immense happiness.`,
    ``,
    `Celebrate this moment to the fullest—you’ve earned it!`,
  ];

  // Adjust line spacing for better readability
  doc.setLineHeightFactor(1.5);
  bodyText.forEach((line) => {
    doc.text(line, marginX, currentY, { maxWidth: doc.internal.pageSize.width - marginX - rightMargin }); // Ensure text doesn't overflow
    currentY += 7;
  });

  // Closing statement and sender's name
  const senderName = document.getElementById('finalSenderName').textContent;
  currentY += 15;
  doc.text("Best wishes,", marginX, currentY);
  currentY += 10;
  doc.text(senderName, marginX, currentY);

  // Save the PDF as a file
  doc.save('Congratulation_Letter.pdf');
}

// Fetch the congratulation letter data when the page loads
window.onload = fetchCongratulationData;

// Add event listener for the download button
document.getElementById('downloadPDFButton').addEventListener('click', generateCongratulationPDF);
