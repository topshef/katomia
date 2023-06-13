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
	  padding: 10px; /* Add padding to the input box */
	
    }
    
    button {
      padding: 10px 20px;
      margin-top: 10px;
      border: none;
      background-color: #e9e9e9;
      cursor: pointer;
	  font-family: 'Poppins', sans-serif; /* Switch the font to Poppins */
      border-radius: 8px; /* Round the corners of the button */
      transition: background-color 0.3s, transform 0.3s; /* Add a transition effect */
    }

    button:hover {
      background-color: #f5f5f5; /* Lighten the background color when hovering */
      transform: scale(1.05); /* Add a slight scaling effect when hovering */
    }
    
    img.logo {
      height: 100px;
    }
  </style>
  <script>

    function parseKatomic(data) {
      // Dummy processor function to preprocess the data
      const dataArray = data.split('\n').map(line => line.trim()); // Split into an array by line and trim each line
      return dataArray;
    }

    async function postData(inputData) {
      const response = await fetch('https://kpos.uk/deal/write/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputText: inputData }) // Send the processed data as JSON
      });
      const responseData = await response.text();
      console.log(responseData);
    }

    function handleClick() {
      const inputText = document.getElementById('myInput').value;
      const processedData = parseKatomic(inputText); // Preprocess the data
      postData(processedData); // Pass the processed data to the postData function
    }

/*
server test with php
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData, true);

echo "JSON data received:\n";
print_r($data);
*/
  </script>
</head>
<body>
  <img src="logo.png" alt="Logo" class="logo">
  <textarea id="myInput" placeholder="Enter your text"></textarea>
  <button onclick="handleClick()">Click Me</button>
</body>
</html>
