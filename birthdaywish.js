document.getElementById('letterForm').addEventListener('submit', async(e) => {
    e.preventDefault();
    const senderAddress = document.getElementById('senderAddress').value;
    const letterdate = document.getElementById('date').value;
    const receiverName = document.getElementById('receiverName').value;
    const senderName=document.getElementById('senderName').value;
    console.log(senderAddress);
    console.log(letterdate);
    console.log(receiverName);
    console.log(senderName);
    const userId=sessionStorage.getItem('userId')
    const birthdaysession=sessionStorage.getItem('birtdaysession')
    console.log(userId)
    if(birthdaysession===null){
 const response = await fetch('http://localhost:3000/birthday_wish_letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify({
          senderAddress:senderAddress,
          letterdate:letterdate,
          receiverName:receiverName,
          senderName:senderName,
          userId:userId
      }),
      
  });
  const result = await response.json();
  if (response.ok) {
    sessionStorage.setItem('birtdaysession', result.letterId);
      alert("DETAILS COLLECTED SUCCESSFULLY");
      window.location.href = "birthdaywishgenerated.html";
  } else {
      alert('Error : ' + result.error);
  }
    }else
    {
        const response = await fetch('http://localhost:3000/update-birthday_wish_letter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', 
            body: JSON.stringify({
                senderAddress:senderAddress,
                letterdate:letterdate,
                receiverName:receiverName,
                senderName:senderName,
                userId:userId,
                birthdaysession:birthdaysession
            }),
            
        });
        const result = await response.json();
        if (response.ok) {
            alert("DETAILS UPDATED SUCCESSFULLY");
            window.location.href = "birthdaywishgenerated.html";
        } else {
            alert('Error : ' + result.error);
        }   
    }     
  }
  )