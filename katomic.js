

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
	  const alias = {}
	  let network =''
	  const addHbarTransfer = []
	  const addTokenTransfer = []
	  const addNftTransfer = []
	  const display = {} // optional: title, description, thumbnail, button label
	  const comments = []
	  
	  let result
      // lines.forEach(line => {
	  const pendingLines = lines.filter(line => {


		if (line.trim() === '') return false // drop empty lines
		
		result = detectComment(line)
		if (result) {
			comments.push(line)
			return false
		}
		
        result = detectNetwork(line)
		if (result) {
			network = result
			return false
		}
		
        result = detectDisplayParameter(line)
		if (result) {
			//display.push(result)
			Object.assign(display, result)
			return false
		}

        result = detectAlias(line)
		if (result) {
			Object.assign(alias, result)
			//alias.push(result)
			return false
		}

		userInput = line
		line = injectAlias(line, alias)
		console.log('line is' ,line)
		
		
		result = detectTransferHbar(line)
		if (result) {
			addHbarTransfer.push({...result, userInput})
			return false
		}
		
		result = detectTransferFT(line)
		if (result) {
			addTokenTransfer.push({...result, userInput})
			return false
		}


		result = detectTransferNFT(line)
		if (result) {
			addNftTransfer.push({...result, userInput})
			return false
		}
		
		return true
      })



/* to consider later for refactor
let detectionFuncs = [
    {func: detectComment, action: (line) => comments.push(line)},
    {func: detectNetwork, action: (result) => {network = result}},
    {func: detectAlias, action: (result) => {Object.assign(alias, result)}}
];

for(let i = 0; i < detectionFuncs.length; i++) {
    result = detectionFuncs[i].func(line);
    if (result) {
        detectionFuncs[i].action(result);
        return false;
    }
}


*/
	  
      return {network, display, alias, addHbarTransfer, addTokenTransfer, addNftTransfer, pendingLines, comments, userInput: data} 
    }

	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ┌─┐┌─┐┌┬┐┌┬┐┌─┐┌┐┌┌┬┐
	 // ││├┤  │ ├┤ │   │   │  │ │││││││├┤ │││ │ 
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   └─┘└─┘┴ ┴┴ ┴└─┘┘└┘ ┴ 
	// detect comments
	function detectComment(line) {
	  if (line.startsWith('#')) return true;
	  if (line.startsWith('//')) return true;
	  if (line.startsWith('/*') && line.endsWith('*/')) return true;
	  return false;
	}

	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ┌┐┌┌─┐┌┬┐┬ ┬┌─┐┬─┐┬┌─
	 // ││├┤  │ ├┤ │   │   │││├┤  │ ││││ │├┬┘├┴┐
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   ┘└┘└─┘ ┴ └┴┘└─┘┴└─┴ ┴
	// detect network
	function detectNetwork(line) {
	  //const pattern = /we are on (\w+net)/
	  //const pattern = /we are on (\w+net)/i;  // case insensitive
	  //const pattern = /on (\w+net)/i
	  const pattern = /(\w+net)\b/i
	  const match = line.match(pattern)
	  
	  //if (match) return match[1]
	  if (match) return match[1].toLowerCase() // lower case output
	  return false
	}


	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ┌┬┐┬┌─┐┌─┐┬  ┌─┐┬ ┬  ┌─┐┌─┐┬─┐┌─┐┌┬┐┌─┐┌┬┐┌─┐┬─┐┌─┐
	 // ││├┤  │ ├┤ │   │    │││└─┐├─┘│  ├─┤└┬┘  ├─┘├─┤├┬┘├─┤│││├┤  │ ├┤ ├┬┘└─┐
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   ─┴┘┴└─┘┴  ┴─┘┴ ┴ ┴   ┴  ┴ ┴┴└─┴ ┴┴ ┴└─┘ ┴ └─┘┴└─└─┘
	// detect display parameters

	function detectDisplayParameter(line) {
	  //const regex = /display\s+(\w+)\s+(.+)/;
      const regex = /display\s+(title|description|thumbnail|button)\s+(.+)/
	  const matches = line.match(regex)

	  if (matches) {
		const [, field, value] = matches
		return { [field]: value }
	  }

	  return false
	}


	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ┬ ┬┌┐ ┌─┐┬─┐  ┌┬┐┬─┐┌─┐┌┐┌┌─┐┌─┐┌─┐┬─┐
	 // ││├┤  │ ├┤ │   │   ├─┤├┴┐├─┤├┬┘   │ ├┬┘├─┤│││└─┐├┤ ├┤ ├┬┘
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   ┴ ┴└─┘┴ ┴┴└─   ┴ ┴└─┴ ┴┘└┘└─┘└  └─┘┴└─
	// detect hbar transfer

	function detectTransferHbar(line) {
		const pattern = /^(\d+\.\d+\.\d+) (receives|sends) ([0-9.]+) (hbar|h)$/
		const matches = line.match(pattern)
		if (!matches) return false
		
		let [_, accountId, verb, value, unit] = matches
		if (verb == 'sends') value = -1 * value 
		
		return {accountId, value}
	}


	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ╔═╗╔╦╗  ┌┬┐┬─┐┌─┐┌┐┌┌─┐┌─┐┌─┐┬─┐
	 // ││├┤  │ ├┤ │   │   ╠╣  ║    │ ├┬┘├─┤│││└─┐├┤ ├┤ ├┬┘
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   ╚   ╩    ┴ ┴└─┴ ┴┘└┘└─┘└  └─┘┴└─
	// detect FT transfer	
	function detectTransferFT(line) {
		const pattern = /^(\d+\.\d+\.\d+) (receives|sends) ([0-9.]+) (\d+\.\d+\.\d+)$/
		const matches = line.match(pattern)
		if (!matches) return false
		
		let [_, accountId, verb, value, tokenId] = matches
		if (verb == 'sends') value = -1 * value 
		
		return {tokenId, accountId, value}
		
		//matching https://docs.hedera.com/hedera/sdks-and-apis/sdks/tokens/transfer-tokens
	}


	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ╔╗╔╔═╗╔╦╗  ┌┬┐┬─┐┌─┐┌┐┌┌─┐┌─┐┌─┐┬─┐
	 // ││├┤  │ ├┤ │   │   ║║║╠╣  ║    │ ├┬┘├─┤│││└─┐├┤ ├┤ ├┬┘
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   ╝╚╝╚   ╩    ┴ ┴└─┴ ┴┘└┘└─┘└  └─┘┴└─
	// detect NFT transfer
	function detectTransferNFT(line) {
		//const pattern = /^(\d+\.\d+\.\d+) sends NFT (\d+\.\d+\.\d+)-(\d+) to (\d+\.\d+\.\d+)$/
		//const pattern = /^(\d+\.\d+\.\d+) sends(?: NFT)? (\d+\.\d+\.\d+)(?:-|#)(\d+) to (\d+\.\d+\.\d+)$/;
		const pattern = /^(\d+\.\d+\.\d+) sends(?: NFT)? (\d+\.\d+\.\d+)(?: ?[-#])(\d+) to (\d+\.\d+\.\d+)$/;
		
		

		const matches = line.match(pattern)
		if (!matches) return false
		
		const [_, sender, tokenId, serial, receiver] = matches
		
		return {sender, tokenId, serial, receiver}
		
		//matching https://docs.hedera.com/hedera/sdks-and-apis/sdks/tokens/transfer-tokens
	}


	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ┌─┐┌┐┌┌┬┐  ┬┌┐┌ ┬┌─┐┌─┐┌┬┐  ┌─┐┬  ┬┌─┐┌─┐
	 // ││├┤  │ ├┤ │   │   ├─┤│││ ││  ││││ │├┤ │   │   ├─┤│  │├─┤└─┐
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   ┴ ┴┘└┘─┴┘  ┴┘└┘└┘└─┘└─┘ ┴   ┴ ┴┴─┘┴┴ ┴└─┘
	// detect and inject alias
	
	// inject known alias into line
	function injectAlias(line, aliases) {
		let pattern = /^([a-zA-Z0-9\.]+)\s+(sends|receives)\s+(.+)$/;
		if (!pattern.test(line)) return line;
		for (let alias in aliases) 
			line = line.replace(new RegExp(alias, 'g'), aliases[alias]);
		return line;
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
	  
	  updateKatomicURL() // update the URL so it can be bookmarked or copied
	  
     if (processedData.pendingLines.length == 0)
		document.getElementById('bannerNotice').innerHTML = 'Preview updated ☑️'
	 else {
		 const pending = processedData.pendingLines.join('<br>');
		 document.getElementById('bannerNotice').innerHTML = `⚠️ Some lines were not understood, please check:<BR>${pending}`
		 
	 }
	  return processedData
    }


	// ┌─┐┌─┐┌─┐┬ ┬  ┌─┐┌─┐┬─┐┌┬┐┌─┐┬  ┬┌┐┌┬┌─
	// │  │ │├─┘└┬┘  ├─┘├┤ ├┬┘│││├─┤│  ││││├┴┐
	// └─┘└─┘┴   ┴   ┴  └─┘┴└─┴ ┴┴ ┴┴─┘┴┘└┘┴ ┴
	// copy permalink

	// copy button
	document.getElementById('btnCopyPermalink').innerHTML = getCopyIconSVG() // + ' Copy Permalink';

	function getCopyIconSVG() {
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18px" height="18px">
		  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
		  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
		</svg>`;
	}

	document.getElementById('btnCopyPermalink').addEventListener('click', copyPermalink)

	async function copyPermalink() {
		const deal = await handlePreview() // refresh preview
		
		updateKatomicURL() // Update the URL in the address bar
		
		// Copy permalink to clipboard
		navigator.clipboard.writeText(window.location.href)

		document.getElementById('bannerNotice').innerHTML = '<a href="' + window.location.href + '" target="_blank">A permalink has been copied to clipboard</a>'
	}


	function updateKatomicURL() {
	  // Update the URL in the address bar
	  const katomicScript = document.getElementById('myInputKscript').value
	  const url = new URL(window.location.href);
	  url.searchParams.set('kscript', katomicScript);
	  history.replaceState(null, '', url.toString());
	}


	// ┌─┐┬ ┬┌┐ ┬  ┬┌─┐┬ ┬  ┬┌─┌─┐┌┬┐┌─┐┌┬┐┬┌─┐  ┌─┐┌─┐┬─┐┬┌─┐┌┬┐
	// ├─┘│ │├┴┐│  │└─┐├─┤  ├┴┐├─┤ │ │ ││││││    └─┐│  ├┬┘│├─┘ │ 
	// ┴  └─┘└─┘┴─┘┴└─┘┴ ┴  ┴ ┴┴ ┴ ┴ └─┘┴ ┴┴└─┘  └─┘└─┘┴└─┴┴   ┴ 
	// publish katomic script

	document.getElementById('btnPublish').addEventListener('click', publishData)

    async function publishData() {
	  const deal = await handlePreview()
	  if (deal.pendingLines.length !== 0) {
		const pending = deal.pendingLines.join('<br>');

		document.getElementById('bannerNotice').innerHTML = `⚠️ Some lines were not understood - please check:<BR>${pending}`  
	    return
	  }
	  
	  const totalTransfers = deal.addHbarTransfer.length + deal.addTokenTransfer.length + deal.addNftTransfer.length
	  if (totalTransfers == 0) {
		  document.getElementById('bannerNotice').innerHTML = `⚠️ No transfers found - please specify some transfers`  
	    return
	  }
	  
      const response = await fetch('https://kpos.uk/deal/write/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deal) // Send the processed data as JSON
      })
	  const responseText = await response.text()
	  
	  document.getElementById('bannerNotice').innerHTML =  responseText
	  
    }




	// ┌┬┐┬─┐┌─┐┌─┐┬ ┬
	 // │ ├┬┘├─┤└─┐├─┤
	 // ┴ ┴└─┴ ┴└─┘┴ ┴
	 // trash
	 
	document.getElementById('btnClear').addEventListener('click', function() {
		 var confirmAction = confirm("Start a new script?")
		 if (confirmAction) document.getElementById("myInputKscript").value = ''
		 return
	})



	//placeholder.. templates
    var dropdown = document.getElementById("kscriptTemplateOptions");
    var myInputKscript = document.getElementById("myInputKscript");

    dropdown.addEventListener("change", function() {
      var selectedOption = dropdown.value;

      if (myInputKscript.value.trim() !== "") {
        var confirmOverwrite = confirm("There's already a value. Do you want to overwrite it?");
        if (!confirmOverwrite) {
          dropdown.value = ""; // Reset the dropdown to the default option
          return; // Exit the event listener
        }
      }

      myInputKscript.value = selectedOption;
	})