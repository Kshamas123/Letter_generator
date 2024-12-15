
const buttons = document.querySelectorAll('.letter-button');


const letterPages = {
  "Invitation Letter": "invitation.html",
  "Birthday Letter": "birthdaywish.html",
  "Congratulations Letter": "congrats.html",
  "Letter D": "letterD.html",
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


buttons.forEach(button => {
  button.addEventListener('click', () => {
    const letterName = button.textContent.trim(); 
    const page = letterPages[letterName]; // Find the corresponding HTML page
    if (page) {
      window.location.href = page; // Navigate to the page
    } else {
      alert('Page not found for this letter.');
    }
  });
});

