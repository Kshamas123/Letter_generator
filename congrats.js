function goToDashboard() {
    window.location.href = "userdashboard.html";
  }
document.getElementById('letterForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Getting form input values
    const senderAddress = document.getElementById('senderAddress').value;
    const letterdate = document.getElementById('date').value;
    const receiverName = document.getElementById('receiverName').value;
    const reason = document.getElementById('reason').value;
    const senderName = document.getElementById('senderName').value;

    // Logging values for debugging (you can remove this in production)
    console.log(senderAddress);
    console.log(letterdate);
    console.log(receiverName);
    console.log(reason);
    console.log(senderName);

    // You can fetch userId from session storage if needed
    const userId = sessionStorage.getItem('userId');
    const letterId=sessionStorage.getItem('congratsletterid');
    console.log(userId);

    // Send the data to the server (if necessary for your project)
    if(letterId===null){const response = await fetch('http://localhost:3000/congratulations_letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({
            senderAddress: senderAddress,
            letterdate: letterdate,
            receiverName: receiverName,
            reason: reason,
            senderName: senderName,
            userId: userId
        }),
    });

    const result = await response.json();

    // Handling the response
    if (response.ok) {
        sessionStorage.setItem('congratsletterid', result.letterId);
        alert("Details collected successfully!");

        // Redirect to the generated congratulations letter page (gencongrats.html)
        window.location.href = "gen-congrats.html";  // Change this URL as needed
    } else {
        alert('Error: ' + result.error);
    }}
    else
    {
        const response = await fetch('http://localhost:3000/update-congratulation_letter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', 
            body: JSON.stringify({
                senderAddress: senderAddress,
                letterdate: letterdate,
                receiverName: receiverName,
                reason: reason,
                senderName: senderName,
                userId: userId,
                letterId:letterId
            }),
            
        });
        const result = await response.json();
        if (response.ok) {
            alert("DETAILS UPDATED SUCCESSFULLY");
            window.location.href = "gen-congrats.html";
        } else {
            alert('Error : ' + result.error);
        } 
    }
});
