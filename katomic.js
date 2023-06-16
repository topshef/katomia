

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
      // lines.forEach(line => {
	  const pendingLines = lines.filter(line => {
		  
        const result = detectAlias(line)
		if (result) {
			alias.push(result)
			return false
		}

		// alias.push({[line]: `no alias found on this line: ${line}`})

		return true
      })
	  
      return {alias, pendingLines, userInput: data} 
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
