
const buttons = document.querySelectorAll('.letter-button');


const letterPages = {
  "Invitation Letter": "invitation.html",
  "Birthday Letter": "birthdaywish.html",
  "Congratulations Letter": "congrats.html",
  "Leave Letter": "leave_letter.html",
  "Letter E": "letterE.html",
  "Letter F": "letterF.html",
  "Letter G": "letterG.html",
  "Letter H": "letterH.html",
  "Letter I": "letterI.html",
  "Letter J": "letterJ.html",
  "Letter K": "letterK.html",
  "Letter L": "letterL.html",
  "Letter M": "letterM.html",
  "Letter N": "letterN.html"
};

function clearSessionExceptUserId() {
  const userIdValue = sessionStorage.getItem('userId'); // Store userId value temporarily

  sessionStorage.clear(); // Clear all session storage

  sessionStorage.setItem('userId', userIdValue); // Restore userId back into sessionStorage
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    clearSessionExceptUserId();
    const letterName = button.textContent.trim(); 
    const page = letterPages[letterName]; // Find the corresponding HTML page
    if (page) {
      window.location.href = page; // Navigate to the page
    } else {
      alert('Page not found for this letter.');
    }
  });
});

