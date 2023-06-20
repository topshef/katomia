

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
      const deal = parseKatomic(katomicScript)
	  
	  const previewDiv = document.getElementById('preview')
	  previewDiv.innerText = JSON.stringify(deal, null, 2)
	  previewDiv.style.display = 'block'
	  
	  updateKatomicURL() // update the URL so it can be bookmarked or copied
	  
	 //check transfers
	 const isValid = await verifyData(deal)
	 if (isValid) document.getElementById('bannerNotice').innerHTML = 'Looks good! Ready to publish ☑️'

	  return deal
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




	// ┌─┐┬ ┬┌─┐┌─┐┬┌─  ┌┬┐┬─┐┌─┐┌┐┌┌─┐┌─┐┌─┐┬─┐┌─┐
	// │  ├─┤├┤ │  ├┴┐   │ ├┬┘├─┤│││└─┐├┤ ├┤ ├┬┘└─┐
	// └─┘┴ ┴└─┘└─┘┴ ┴   ┴ ┴└─┴ ┴┘└┘└─┘└  └─┘┴└─└─┘
	// check transfers
	async function verifyData(deal) {
	  
		if (deal.pendingLines.length !== 0) {
			const pending = deal.pendingLines.join('<br>');

			document.getElementById('bannerNotice').innerHTML = `⚠️ Some lines were not understood - please check:<BR>${pending}`  
			return false
		 }
		  
		const totalTransfers = deal.addHbarTransfer.length + deal.addTokenTransfer.length + deal.addNftTransfer.length
		if (totalTransfers == 0) {
		  document.getElementById('bannerNotice').innerHTML = `⚠️ No transfers found - please specify some transfers`  
		return false
		}

		// check hbar transfers
		let sumHbar = 0
		for (const transfer of deal.addHbarTransfer) 
		sumHbar += parseInt(transfer.value)

		if (sumHbar != 0) {
			document.getElementById('bannerNotice').innerHTML = `⚠️ Hbar transfers must sum to zero`  
			return false
		}

		// check FT transfers
		let sumFT = {}
		for (const transfer of deal.addTokenTransfer) {
			if (!sumFT[transfer.tokenId]) sumFT[transfer.tokenId] = 0
			sumFT[transfer.tokenId] += parseInt(transfer.value)
		}

		for (let tokenId in sumFT) {
		  if (sumFT[tokenId] != 0) {
			document.getElementById('bannerNotice').innerHTML = `⚠️ FT transfers must sum to zero for token ${tokenId}`  
			return false
		  }
		}
		
		return true
	}
	
	// ┬ ┬┌─┐┬  ┌─┐  ┬ ┬┌─┐┬─┐┌─┐┌─┐
	// ├─┤├┤ │  ├─┘  ├─┤├┤ ├┬┘├┤  ┌┘
	// ┴ ┴└─┘┴─┘┴    ┴ ┴└─┘┴└─└─┘ o 
	// later maybe give warning if any accounts are not token associated as needed, and/or don't have funds
	// follow-up for volunteer to learn/demo knowledge of mirror nodes
	// maybe attach this to a separate button, and/or use it on marketplaces
			
	async function isDealExecutableNow(deal) {
		// insert checks here
		
		return true
	}
	
	// ┌─┐┬ ┬┌┐ ┬  ┬┌─┐┬ ┬  ┬┌─┌─┐┌┬┐┌─┐┌┬┐┬┌─┐  ┌─┐┌─┐┬─┐┬┌─┐┌┬┐
	// ├─┘│ │├┴┐│  │└─┐├─┤  ├┴┐├─┤ │ │ ││││││    └─┐│  ├┬┘│├─┘ │ 
	// ┴  └─┘└─┘┴─┘┴└─┘┴ ┴  ┴ ┴┴ ┴ ┴ └─┘┴ ┴┴└─┘  └─┘└─┘┴└─┴┴   ┴ 
	// publish katomic script

	document.getElementById('btnPublish').addEventListener('click', publishData)

    async function publishData() {
	  const deal = await handlePreview()
	   
	 //check transfers
	 const isValid = await verifyData(deal)
	  if (!isValid) return
	  	   
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
		 if (confirmAction) {
			 document.getElementById("myInputKscript").value = ''
			updateKatomicURL()
			
			//reset the dropdown
			document.getElementById("kscriptTemplateOptions").selectedIndex = 0
			//same thing..
			//document.getElementById("kscriptTemplateOptions").value = ''
		 }
		 return
	});


	// ┬┌─┌─┐┌┬┐┌─┐┌┬┐┬┌─┐  ┌┬┐┌─┐┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐┌─┐
	// ├┴┐├─┤ │ │ ││││││     │ ├┤ │││├─┘│  ├─┤ │ ├┤ └─┐
	// ┴ ┴┴ ┴ ┴ └─┘┴ ┴┴└─┘   ┴ └─┘┴ ┴┴  ┴─┘┴ ┴ ┴ └─┘└─┘
	// katomic templates
	
	// example templates to get people going
	// create a templates.txt file with a list of published dealId's and a label to use in the drop-down
	// the dealId only needs to be long enough to result in a unique match when queried
	// but the full 64 char id can be used, per HCS appnet
	
	//placeholder.. templates
	
    let dropdown = document.getElementById("kscriptTemplateOptions")

    dropdown.addEventListener("change", async function() {
      let dealId = dropdown.value
	  let myInputKscript = document.getElementById("myInputKscript")
	  
      if (myInputKscript.value.trim() !== "") {
        let confirmOverwrite = confirm("This will overwrite your current script, ok?")
        if (!confirmOverwrite) {
          dropdown.value = '' // Reset the dropdown to the default option
          return // Exit the event listener
        }
      }
	  
	  let deal = await getDeal(dealId)
      let kscript = deal.userInput ?? 'Katomic script not found (deal may pre-date Kato!)'  
      myInputKscript.value = kscript

	})
	
	
	
//dev test
if (new URLSearchParams(window.location.search).has("test")) { 
	(async function () {
		const zz = await getTemplateList()
		alert(JSON.stringify(zz))
	})()

}

	getTemplateList()
	
	async function getTemplateList() {
	  const url = 'templates.txt'
	  const response = await fetch(url)
	  const text = await response.text()

	  const lines = text.split('\n')

	  // Select the drop-down list
	  const select = document.getElementById('kscriptTemplateOptions')
	  let option 
	  
	  for (const line of lines) {
		const [dealId, label] = line.split('=')
		if (!dealId || dealId.startsWith('#') || dealId.startsWith('//')) continue
		
		// Create new option element
		option = document.createElement('option')
		option.value = dealId
		option.text = label

		// Add the option to the drop-down list
		select.add(option)

	  }

	}

	
	async function getDeal(dealId) {
		// fetch deal from kpos appnet
		// either use kpos (Kpay point-of-sale) as endpoint
		// or you can call decentralised nodes via HCS, details to be posted shortly
		// eg HCS messages contain the deal IDs, and the operator is the node owner
		// node owners can publish their endpoints by posting a message with the url
		// or keep it private as they prefer (so the deal info is not public)
		
		// dealId is 64 chars but you can query a shorter length and a result is returned so long as the match is unique
		// eg 79d28d5bf3ac6c867ec82a150158fc21c7976f5a911e08c6b686487376897cb0
		// network can be added to the query parameters, but if omitted this is located automatically
		
		const url = `https://kpos.uk/deal/query/?dealId=${dealId}`
		const response = await fetch(url)
		const result = await response.json()
		return result.deal
	}
