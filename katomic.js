

	//https://manytools.org/hacker-tools/ascii-banner/


	// ┌─┐┌─┐┌─┐┌─┐  ┬  ┌─┐┌─┐┌┬┐
	// ├─┘├─┤│ ┬├┤   │  │ │├─┤ ││
	// ┴  ┴ ┴└─┘└─┘  ┴─┘└─┘┴ ┴─┴┘
	// page load

	let CONFIG  // global constants eg urlPublish
	document.addEventListener('DOMContentLoaded', async (event) => {
	  handleLogoImage()
	  CONFIG = await getConfig()
	  console.log('config=', CONFIG)
	  handleQueryParams() // no need to await because we're not (yet) processing any response or chaining anything after this
	})


	// ┌─┐┌─┐┌┬┐  ┌─┐┌─┐┌┐┌┌─┐┬┌─┐  ┬┌─┐┌─┐┌┐┌
	// │ ┬├┤  │   │  │ ││││├┤ ││ ┬  │└─┐│ ││││
	// └─┘└─┘ ┴   └─┘└─┘┘└┘└  ┴└─┘o└┘└─┘└─┘┘└┘
	// get config.json
	
	async function getConfig() {
	  try {
		const response = await fetch(PATH_CONFIG)
		//if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
		return await response.json()

	  } catch (error) {
		console.log('Failed to load config.json:', error)
		console.log('switching to getDefaultConfig')
		return getDefaultConfig()
	  }
	}


	function getDefaultConfig() {
	  const defaultConfigJson = `
		{
		"testnet": {
		  "urlPublish": "https://labs4.shop.gomint.me/m/?dealonly&detail&dealId=\${dealId}"
		},
		"mainnet": {
		  "urlPublish": "https://swap.kpay.live.me/m/?dealonly&detail&dealId=\${dealId}"
		}
	  }
`
	  return JSON.parse(defaultConfigJson.trim())
	}


	// ┌─┐┬─┐┌─┐┌┐   ┬ ┬┬─┐┬    ┌─┐ ┬ ┬┌─┐┬─┐┬ ┬
	// │ ┬├┬┘├─┤├┴┐  │ │├┬┘│    │─┼┐│ │├┤ ├┬┘└┬┘
	// └─┘┴└─┴ ┴└─┘  └─┘┴└─┴─┘  └─┘└└─┘└─┘┴└─ ┴ 
	// grab url query

	// Get the URL parameter value
	const urlQuery = new URLSearchParams(window.location.search)
	const kscript = urlQuery.get('kscript')

	// Set the value of the textarea
	if (kscript)
	if (urlQuery.has('typingspeed') && typeof simulateTyping === 'function') {
		  let typingspeed = urlQuery.get('typingspeed') ?? 10
		  typingNow = simulateTyping('myInputKscript', kscript, {speed: typingspeed})
	}
	else document.getElementById('myInputKscript').value = kscript // fallback
	  
	

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
		//const pattern = /^(\d+\.\d+\.\d+) (receives|sends) ([0-9.]+) (hbar|h)$/
		const pattern = /^(buyer|\d+\.\d+\.\d+) (receives|sends) ([0-9.]+) (hbar|h)$/
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
		//const pattern = /^(\d+\.\d+\.\d+) (receives|sends) ([0-9.]+) (\d+\.\d+\.\d+)$/
		const pattern = /^(buyer|\d+\.\d+\.\d+) (receives|sends) ([0-9.]+) (\d+\.\d+\.\d+)$/
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
		//const pattern = /^(\d+\.\d+\.\d+) sends(?: NFT)? (\d+\.\d+\.\d+)(?: ?[-#])(\d+) to (\d+\.\d+\.\d+)$/
		const pattern = /^(buyer|\d+\.\d+\.\d+) sends(?: NFT)? (\d+\.\d+\.\d+)(?: ?[-#])(\d+) to (buyer|\d+\.\d+\.\d+)$/

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
		let pattern = /^([a-zA-Z0-9\._-]+)\s+(sends|receives)\s+(.+)$/;
		if (!pattern.test(line)) return line;
		for (let alias in aliases) 
			line = line.replace(new RegExp("\\b" + alias + "\\b", 'g'), aliases[alias]);
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
		
		// also offer a demo link with typing animation..
		document.getElementById('bannerNotice').innerHTML += '<BR><div id="typing"></div>'
		
		//if (typeof simulateTyping === 'function') console.log('function simulateTyping exists ok')
		typingNow = simulateTyping('typing', "Or grab a ", {speed: 20, elementProperty: 'innerHTML'})
		await typingNow.promise

		const linkTyping = '<a id="demolink" href="' + window.location.href + '&typingspeed=30" target="_blank"></a>'
		document.getElementById('typing').innerHTML += linkTyping
		typingNow = simulateTyping('demolink', 'demo link', {speed: 20, elementProperty: 'innerHTML'})
		//await typingNow.promise

	}


	function updateKatomicURL() {
	  // Update the URL in the address bar
	  const katomicScript = document.getElementById('myInputKscript').value
	  const url = new URL(window.location.href)
	  url.searchParams.delete('dealId') // if it exists
	  url.searchParams.delete('typingspeed') // if it exists
	  if (katomicScript == '') url.searchParams.delete('kscript')
	  else url.searchParams.set('kscript', katomicScript)
	  history.replaceState(null, '', url.toString())
	  
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
		let sumHbar = 0.0
		for (const transfer of deal.addHbarTransfer) 
			sumHbar += parseFloat(transfer.value)

		sumHbar = parseFloat(sumHbar.toFixed(8))
		
		if (sumHbar != 0) {
			document.getElementById('bannerNotice').innerHTML = `⚠️ Hbar transfers must sum to zero`  
			return false
		}

		// check FT transfers
		let sumFT = {}
		for (const transfer of deal.addTokenTransfer) {
			if (!sumFT[transfer.tokenId]) sumFT[transfer.tokenId] = 0
			sumFT[transfer.tokenId] += parseFloat(transfer.value)
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
		   
		const response = await fetch('https://kpos.uk/deal/write/?json', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(deal) // Send the processed data as JSON
		})

		const result = await response.json()

		const { network, dealId, isExisting } = result

		// display result to user
		let html = isExisting ? 'Existing deal found.' : 'Published!'

		//let domain = network == 'mainnet' ? 'swap.kpay.live' : 'labs4.shop.gomint.me'
		//let redirectURL = `https://${domain}/m/?dealonly&detail&dealId=${dealId}&starttime=5mins`
		let dealId_short = dealId.substring(0, 6).toUpperCase()

		
		let urlPublish = CONFIG[network].urlPublish

		urlPublish = urlPublish.replace('${dealId}', dealId)

		let starttime = '5mins'

		let link = `<a href="${urlPublish}&starttime=${starttime}" target="_blank">${dealId_short}</a>`;

		//let link = `<a href="https://${domain}/m/?dealonly&detail&dealId=${dealId}&starttime=5mins" target="_blank">${dealId_short}</a>`;
		html += ` See ref ${link}`;
		//html += ' (refactor test)'

	  // todo.. switch to json and handle here
	  //document.getElementById('bannerNotice').innerHTML =  responseText
	  document.getElementById('bannerNotice').innerHTML =  html
	  //const dealId =  (responseText.match(/([0-9a-fA-F]{6,})/) || [])[1];
	  
	  return {network, dealId, urlPublish}
	  
    }


	// ┌┬┐┬─┐┌─┐┌─┐┬ ┬
	 // │ ├┬┘├─┤└─┐├─┤
	 // ┴ ┴└─┴ ┴└─┘┴ ┴
	 // trash
	 
	document.getElementById('btnClear').addEventListener('click', function() {
		 var confirmAction = confirm("Start a new script?")
		 if (confirmAction) {
			 if (typingNow) typingNow.cancel()
		     urlQuery.delete('typingspeed') // if it exists
			 document.getElementById("myInputKscript").value = ''
			 document.getElementById('bannerNotice').innerHTML = ''
			 document.getElementById('preview').style.display = 'none'
			 updateKatomicURL()
			
			//reset the dropdown
			document.getElementById("kscriptTemplateOptions").selectedIndex = 0
			//same thing..
			//document.getElementById("kscriptTemplateOptions").value = ''
		 }
		 return
	});


	//optional integrations...

	// ┬┌─┌─┐┌┬┐┌─┐┌┬┐┬┌─┐  ┌┬┐┌─┐┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐┌─┐
	// ├┴┐├─┤ │ │ ││││││     │ ├┤ │││├─┘│  ├─┤ │ ├┤ └─┐
	// ┴ ┴┴ ┴ ┴ └─┘┴ ┴┴└─┘   ┴ └─┘┴ ┴┴  ┴─┘┴ ┴ ┴ └─┘└─┘
	// katomic templates
	
	// example templates to get people going
	// create a templates.txt file with a list of published dealId's and a label to use in the drop-down
	// the dealId only needs to be long enough to result in a unique match when queried
	// but the full 64 char id can be used, per HCS appnet
	
	//placeholder.. templates
	//already defined let urlQuery = new URLSearchParams(window.location.search)
	 
    let dropdown = document.getElementById("kscriptTemplateOptions")

    dropdown.addEventListener("change", async function() {
      if (typingNow) typingNow.cancel()
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
	  
		  
	  if (urlQuery.has('typingspeed') && typeof simulateTyping === 'function') {
		  myInputKscript.value = ''
		  let typingspeed = urlQuery.get('typingspeed') ?? 10
		  typingNow = simulateTyping('myInputKscript', kscript, {speed: typingspeed})
	  }
	  else myInputKscript.value = kscript // fallback
	  

	})
	

	// ┌┬┐┌─┐┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌┌─┐
	 // │ ├┤ │││├─┘│  ├─┤ │ ├┤   │ │├─┘ │ ││ ││││└─┐
	 // ┴ └─┘┴ ┴┴  ┴─┘┴ ┴ ┴ └─┘  └─┘┴   ┴ ┴└─┘┘└┘└─┘
	// template options
	// update option list from template.txt
	
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


	// ┌─┐┌─┐┌┬┐  ┌┬┐┌─┐┌─┐┬    ┌─┐┬─┐┌─┐┌┬┐  ┌─┐┌─┐┌─┐┌┐┌┌─┐┌┬┐
	// │ ┬├┤  │    ││├┤ ├─┤│    ├┤ ├┬┘│ ││││  ├─┤├─┘├─┘│││├┤  │ 
	// └─┘└─┘ ┴   ─┴┘└─┘┴ ┴┴─┘  └  ┴└─└─┘┴ ┴  ┴ ┴┴  ┴  ┘└┘└─┘ ┴ 
	// get deal from appnet
	
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
		console.log(`fetching ${url}`)
		const response = await fetch(url)
		const result = await response.json()
		return result.deal
	}


	// ┬┌┐┌ ┬┌─┐┌─┐┌┬┐  ┌┬┐┌─┐┌─┐┬    ┌─┐┬─┐┌─┐┌┬┐  ┌─┐┌─┐┌─┐┌┐┌┌─┐┌┬┐
	// ││││ │├┤ │   │    ││├┤ ├─┤│    ├┤ ├┬┘│ ││││  ├─┤├─┘├─┘│││├┤  │ 
	// ┴┘└┘└┘└─┘└─┘ ┴   ─┴┘└─┘┴ ┴┴─┘  └  ┴└─└─┘┴ ┴  ┴ ┴┴  ┴  ┘└┘└─┘ ┴ 
	// inject deal from appnet
	// use this eg to share a tamperproof link for deals that have been published
	
	// insert script from dealId if requested from URL, and no script is present

	async function injectDeal() {
	  let urlQuery = new URLSearchParams(window.location.search)
	  if (urlQuery.has('dealId')) {
		let kscript = document.getElementById("myInputKscript").value
		if (kscript.trim() == '') {
		  let deal = await getDeal(urlQuery.get('dealId'))
		  console.log(deal, deal)
		  kscript = deal.userInput ?? 'Katomic script not found (deal may pre-date Kato!)'
		  //simulateTyping('myInputKscript', kscript, {speed: 20})
		  
			if (urlQuery.has('typingspeed') && typeof simulateTyping === 'function') {
				  let typingspeed = urlQuery.get('typingspeed') ?? 10
				  typingNow = simulateTyping('myInputKscript', kscript, {speed: typingspeed})
			}
			else document.getElementById('myInputKscript').value = kscript // fallback
	
		 // document.getElementById("myInputKscript").value = kscript
		}
	  }
	}
	


	// ┌┬┐┌─┐┬┌─┌─┐  ┬┌─┌─┐┌┬┐┌─┐  ┌┬┐┌─┐┌┐┌┌─┐┌─┐
	// │││├─┤├┴┐├┤   ├┴┐├─┤ │ │ │   ││├─┤││││  ├┤ 
	// ┴ ┴┴ ┴┴ ┴└─┘  ┴ ┴┴ ┴ ┴ └─┘  ─┴┘┴ ┴┘└┘└─┘└─┘
	// make kato dance!

	//handleLogoImage()
	function handleLogoImage() {
		const logoImage = document.getElementById('logo')

		logoImage.addEventListener('mouseover', function() {
		  logoImage.src = 'kato1.png'
		})

		logoImage.addEventListener('mouseout', function() {
		  logoImage.src = 'kato2.png'
		})
	}


	// ┌─┐┬ ┬┌┬┐┌─┐╔═╗┬ ┬┌┐ ┌┬┐┬┌┬┐
	// ├─┤│ │ │ │ │╚═╗│ │├┴┐││││ │ 
	// ┴ ┴└─┘ ┴ └─┘╚═╝└─┘└─┘┴ ┴┴ ┴ 
	// autoSubmit and redirect if requested - for auto upstream/downstream demo
	// eg anyone can use katomic.org as a publish & redirect service
	// beware spoofing though - marketplaces should verify deal hash and trusted operator ID via HCS appnet
	// and buyer-beware on all signing activity

	async function handleQueryParams() {
	  let urlQuery = new URLSearchParams(window.location.search)
	  let dummy = await injectDeal() // no reponse needed atm, review this later though

	  if (urlQuery.has('autoSubmit')) {
		const {network, dealId, urlPublish} = await publishData()
		
		// get redirect url from query, or default. todo error trap/ safety
		let autoSubmitURL = decodeURIComponent(urlQuery.get('autoSubmit')) || urlPublish
//		`https://labs4.shop.gomint.me/m/?dealonly&detail&starttime=5mins&dealId=${dealId}`
		console.log("autoSubmitURL",autoSubmitURL)
		autoSubmitURL = autoSubmitURL.replace('${dealId}', dealId)
		
		window.location.href = autoSubmitURL
	  }
	}


