<!DOCTYPE html>
<html>
<head>
  <title>Simple Webpage</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap');

    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Indie Flower', cursive;
      background-color: #fff7d9;
    }
    
    textarea {
      padding: 10px;
      width: 200px;
      height: 8em;
      resize: both;
      border-radius: 8px; /* Round the corners of the textarea */
      font-family: 'Poppins', sans-serif;
	  /* font-family: 'Indie Flower', cursive;  */
	  font-size: 18px;
    font-weight: bold;
	
    }
    
    button {
      padding: 10px 20px;
      margin-top: 10px;
      border: none;
      background-color: #e9e9e9;
      cursor: pointer;
	  font-family: 'Poppins', sans-serif; /* Switch the font to Poppins */
      border-radius: 8px; /* Round the corners of the button */
    }
    
    img.logo {
      height: 100px;
    }
  </style>
  <script>
    async function postData() {
      const inputText = document.getElementById('myInput').value;
      const response = await fetch('https://kpos.uk/deal/write/', {
        method: 'POST',
        body: new URLSearchParams({ inputText })
      });
      const responseData = await response.text();
      console.log(responseData);
    }
  </script>
</head>
<body>
  <img src="logo.png" alt="Logo" class="logo">
  <textarea id="myInput" placeholder="Enter your text"></textarea>
  <button onclick="postData()">Click Me</button>
</body>
</html>
