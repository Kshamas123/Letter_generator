document.getElementById('letterForm').addEventListener('submit', async(e) => {
    e.preventDefault();
    const senderAddress = document.getElementById('senderAddress').value;
    const letterdate = document.getElementById('date').value;
    const receiverName = document.getElementById('receiverName').value;
    const eventType = document.getElementById('eventType').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventVenue = document.getElementById('eventVenue').value;
    const senderName=document.getElementById('senderName').value;
    console.log(senderAddress);
    console.log(letterdate);
    console.log(receiverName);
    console.log(eventType);
    console.log(eventDate);
    console.log(eventVenue);
    console.log(senderName);
    const userId=sessionStorage.getItem('userId')
    const letterId = sessionStorage.getItem('letterId');
    console.log(userId)
    console.log(letterId)
    if(letterId===null){
 const response = await fetch('http://localhost:3000/invitation_letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify({
          senderAddress:senderAddress,
          letterdate:letterdate,
          receiverName:receiverName,
          eventType:eventType,
          eventDate:eventDate,
          eventVenue:eventVenue,
          senderName:senderName,
          userId:userId
      }),
      
  });
  const result = await response.json();
  if (response.ok) {
    sessionStorage.setItem('letterId', result.letterId);
      alert("DETAILS COLLECTED SUCCESSFULLY");
      window.location.href = "gen-invitation.html";
  } else {
      alert('Error : ' + result.error);
  }
}
else
{
    const response = await fetch('http://localhost:3000/update-invitation_letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({
            senderAddress:senderAddress,
            letterdate:letterdate,
            receiverName:receiverName,
            eventType:eventType,
            eventDate:eventDate,
            eventVenue:eventVenue,
            senderName:senderName,
            userId:userId,
            letterId:letterId
        }),
        
    });
    const result = await response.json();
    if (response.ok) {
        alert("DETAILS UPDATED SUCCESSFULLY");
        window.location.href = "gen-invitation.html";
    } else {
        alert('Error : ' + result.error);
    }  
}
//   const result = await response.json();
//   if (response.ok) {
//     sessionStorage.setItem('letterId', result.letterId);
//       alert("DETAILS COLLECTED SUCCESSFULLY");
//       window.location.href = "gen-invitation.html";
//   } else {
//       alert('Error : ' + result.error);
//   }
        
  }
  )