const letterButtons = document.querySelectorAll('.letter-button');

letterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    alert(`You clicked on: ${button.textContent}`);
  });
});
