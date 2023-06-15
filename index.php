<!DOCTYPE html>
<html>
<head>
  <title>Simple Webpage</title>
  <style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');

    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
	  font-family: 'Poppins', sans-serif;
      background-color: #fff7d9;
    }
    
    textarea {
      padding: 10px;
	  width: 70%;
	  max-width: 500px;
      height: 8em;
      resize: both;
      border-radius: 8px; /* Round the corners of the textarea */
      font-family: 'Poppins', sans-serif;
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
	
	#preview {
	  font-family: 'Source Code Pro', monospace; 
	  white-space: pre;
	  font-size: 80%;
	  padding: 20px;
	  background-color: #f8f8f8; /* Slightly lighter background color */
	  margin: 10px;
	  display: none; 
	}

  </style>
  <script>

    function parseKatomic(data) {
	  const lines = data.split('\n')
	  const alias = [];
      lines.forEach(line => {
        const result = detectAlias(line)
        if (result) {
          alias.push(result)
        }
      })
      return {alias, lines} 
    }

	//todo build in account check using 5 char checksum HIP15 #1
	function detectAlias(line) {
	  const pattern = /^([a-zA-Z0-9_-]+) is (\d+\.\d+\.\d+)$/;
	  const matches = line.match(pattern);
	  if (!matches) return false;
	  const alias = matches[1];
	  const hac = matches[2];
	  return { [alias]: hac };
	}


    async function postData(deal) {
      const response = await fetch('https://kpos.uk/deal/write/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deal }) // Send the processed data as JSON
      })
	  return await response.text()
    }

    async function handleClick() {
      const katomicScript = document.getElementById('myInput').value;
      const processedData = parseKatomic(katomicScript); // Preprocess the data
	  try {
		const responseData = await postData(processedData);
		console.log(responseData);
		const previewDiv = document.getElementById('preview');
		previewDiv.innerText = responseData; // Update the div with the response data
		previewDiv.style.display = 'block';
	  } catch (error) {
		console.error(error);
	  }
  
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
  <button onclick="handleClick()">Preview</button>
  
  <div id='preview'></div>
</body>
</html>
