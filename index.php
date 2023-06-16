<!DOCTYPE html>
<html>
<head>
  <title>Simple Webpage</title>
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

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
      border: 1px solid grey;
      background-color: #e9e9e9;
      cursor: pointer;
	  font-family: 'Poppins', sans-serif; /* Switch the font to Poppins */
      border-radius: 8px; /* Round the corners of the button */
      transition: background-color 0.3s, transform 0.3s; /* Add a transition effect */
	  white-space: nowrap
    }

    button:hover {
      background-color: #f5f5f5; /* Lighten the background color when hovering */
      transform: scale(1.05); /* Add a slight scaling effect when hovering */
	  border: 2px solid grey;
    }
    
    img.logo {
      height: 100px;
	  margin: 10px; 
    }
	
	.logo-text, #bannerNotice {
		margin: 10px; 
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

   a {
      text-decoration: none;
    }
	
  
  #buttonsContainer {
	  display: flex;
	  gap: 10px; /* Add gap between buttons */
	  flex-wrap: nowrap; /* Prevent buttons from wrapping */
	  align-items: center; 
	}

  

</style>
</head>
<body>
  <img src="logo.png" alt="Logo" class="logo">
  <div class="logo-text"> <strong>Kato</strong> is <strong>#katomic</strong></div>
  <textarea id="myInputKscript" placeholder="Enter some #katomic script"></textarea>
  
  <div id='buttonsContainer'>
	  <button id='btnPreview'>Preview</button> 
	  <button id='btnCopyPermalink'>Copy permalink</button>
	  <button id='btnSave'>Save</button> 
  </div>
  <div id='bannerNotice'></div>
  
  <div id='preview'></div>
</body>
</html>


<script>


	//https://manytools.org/hacker-tools/ascii-banner/
	
	// ┌─┐┬─┐┌─┐┌┐   ┬ ┬┬─┐┬    ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
	// │ ┬├┬┘├─┤├┴┐  │ │├┬┘│    │─┼┐│ │├┤ ├┬┘└┬┘
	// └─┘┴└─┴ ┴└─┘  └─┘┴└─┴─┘  └─┘└└─┘└─┘┴└─ ┴ 
	// grab url query

	// Get the URL parameter value
	const urlParams = new URLSearchParams(window.location.search)
	const katomicValue = urlParams.get('kscript')

	// Set the value of the textarea
	const textarea = document.getElementById('myInputKscript')
	textarea.value = katomicValue

	// ┌─┐┌─┐┬─┐┌─┐┌─┐  ┬┌─┌─┐┌┬┐┌─┐┌┬┐┬┌─┐  ┌─┐┌─┐┬─┐┬┌─┐┌┬┐
	// ├─┘├─┤├┬┘└─┐├┤   ├┴┐├─┤ │ │ ││││││    └─┐│  ├┬┘│├─┘ │ 
	// ┴  ┴ ┴┴└─└─┘└─┘  ┴ ┴┴ ┴ ┴ └─┘┴ ┴┴└─┘  └─┘└─┘┴└─┴┴   ┴ 
	// parse katomic script
	
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



	// ┌─┐┬─┐┌─┐┬  ┬┬┌─┐┬ ┬  ┌┬┐┌─┐┌┬┐┌─┐
	// ├─┘├┬┘├┤ └┐┌┘│├┤ │││   ││├─┤ │ ├─┤
	// ┴  ┴└─└─┘ └┘ ┴└─┘└┴┘  ─┴┘┴ ┴ ┴ ┴ ┴
	// preview data

	document.getElementById('btnPreview').addEventListener('click', handlePreview);

    async function handlePreview() {
      const katomicScript = document.getElementById('myInputKscript').value
      const processedData = parseKatomic(katomicScript)
	  
	  const previewDiv = document.getElementById('preview')
	  previewDiv.innerText = JSON.stringify(processedData, null, 2)
	  previewDiv.style.display = 'block'
	  
	  document.getElementById('bannerNotice').innerHTML = 'Preview updated:'
	  return processedData
    }


	// ┌─┐┌─┐┌─┐┬ ┬  ┌─┐┌─┐┬─┐┌┬┐┌─┐┬  ┬┌┐┌┬┌─
	// │  │ │├─┘└┬┘  ├─┘├┤ ├┬┘│││├─┤│  ││││├┴┐
	// └─┘└─┘┴   ┴   ┴  └─┘┴└─┴ ┴┴ ┴┴─┘┴┘└┘┴ ┴
	// copy permalink

	document.getElementById('btnCopyPermalink').addEventListener('click', function() {

		const katomicScript = document.getElementById('myInputKscript').value
		
		// Update the URL in the address bar
		const url = new URL(window.location.href);
		url.searchParams.set('kscript', katomicScript);
		history.replaceState(null, '', url.toString());
		
		// Copy permalink to clipboard
		navigator.clipboard.writeText(window.location.href)

		document.getElementById('bannerNotice').innerHTML = '<a href="' + window.location.href + '" target="_blank">A permalink has been copied to clipboard</a>'
		//document.getElementById('copyConfirmed').style.display = 'inline'
	})


	// ┌─┐┌─┐┬  ┬┌─┐  ┌┬┐┌─┐┌┬┐┌─┐
	// └─┐├─┤└┐┌┘├┤    ││├─┤ │ ├─┤
	// └─┘┴ ┴ └┘ └─┘  ─┴┘┴ ┴ ┴ ┴ ┴
	// save data to server via post request


	document.getElementById('btnSave').addEventListener('click', saveData);

    async function saveData() {
	  const deal = await handlePreview()
		
      const response = await fetch('https://kpos.uk/deal/write/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deal }) // Send the processed data as JSON
      })
	  const responseText = await response.text()
	  
	  document.getElementById('bannerNotice').innerHTML =  responseText
	  
    }

	
</script>