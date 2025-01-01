
function goToDashboard() {
    window.location.href = "userdashboard.html";
  }
  document.getElementById('letterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const senderAddress = document.getElementById('senderAddress').value;
    const letterDate = document.getElementById('date').value;
    const recipientName = document.getElementById('recipientName').value;
    const recipientDesignation = document.getElementById('recipientDesignation').value;
    const organizationName = document.getElementById('organizationName').value;
    const organizationAddress = document.getElementById('organizationAddress').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reason = document.getElementById('reason').value;
    const senderName = document.getElementById('senderName').value;
    const contactDetails = document.getElementById('contactDetails').value;

    console.log(senderAddress);
    console.log(letterDate);
    console.log(recipientName);
    console.log(recipientDesignation);
    console.log(organizationName);
    console.log(organizationAddress);
    console.log(startDate);
    console.log(endDate);
    console.log(reason);
    console.log(senderName);
    console.log(contactDetails);

    const userId = sessionStorage.getItem('userId');
    const leaveletterId = sessionStorage.getItem('leaveletterId');
    console.log(userId);
    console.log(leaveletterId);

    if (leaveletterId === null) {
        const response = await fetch('http://localhost:3000/leave_letter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                senderAddress: senderAddress,
                letterDate: letterDate,
                recipientName: recipientName,
                recipientDesignation: recipientDesignation,
                organizationName: organizationName,
                organizationAddress: organizationAddress,
                startDate: startDate,
                endDate: endDate,
                reason: reason,
                senderName: senderName,
                contactDetails: contactDetails,
                userId: userId
            }),
        });

        const result = await response.json();
        if (response.ok) {
            sessionStorage.setItem('leaveletterId', result.letterId);
            alert("DETAILS COLLECTED SUCCESSFULLY");
            window.location.href = "gen-leave-letter.html";
        } else {
            alert('Error : ' + result.error);
        }
    } else {
        const response = await fetch('http://localhost:3000/update-leave_letter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                senderAddress: senderAddress,
                letterDate: letterDate,
                recipientName: recipientName,
                recipientDesignation: recipientDesignation,
                organizationName: organizationName,
                organizationAddress: organizationAddress,
                startDate: startDate,
                endDate: endDate,
                reason: reason,
                senderName: senderName,
                contactDetails: contactDetails,
                userId: userId,
                letterId: leaveletterId
            }),
        });

        const result = await response.json();
        if (response.ok) {
            alert("DETAILS UPDATED SUCCESSFULLY");
            window.location.href = "gen-leave-letter.html";
        } else {
            alert('Error : ' + result.error);
        }
    }
});
