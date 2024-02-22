

	//https://manytools.org/hacker-tools/ascii-banner/

	let network =''
	let isSumValidationNeeded = true // if variables are used, flip this to false
	//const PATH_CONFIG = 'config.json'

	// ┌─┐┌─┐┌─┐┌─┐  ┬  ┌─┐┌─┐┌┬┐
	// ├─┘├─┤│ ┬├┤   │  │ │├─┤ ││
	// ┴  ┴ ┴└─┘└─┘  ┴─┘└─┘┴ ┴─┴┘
	// page load

	let CONFIG  // global constants eg urlPublish
	document.addEventListener('DOMContentLoaded', async (event) => {
	  handleLogoImage()
	  CONFIG = await getConfig()
	  console.log('config=', CONFIG)
      if (urlQuery.has('dev')) document.getElementById('urlWriteDeal').value = CONFIG['testnet'].urlWriteDeal || 'https://kpos.uk/deal/write/?json'
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
	  
	if (urlQuery.has('dev'))
	  document.querySelectorAll('.dev').forEach(function(element) {
		element.style.display = 'block'
	  })


	// ┌─┐┌─┐┬─┐┌─┐┌─┐  ┬┌─┌─┐┌┬┐┌─┐┌┬┐┬┌─┐  ┌─┐┌─┐┬─┐┬┌─┐┌┬┐
	// ├─┘├─┤├┬┘└─┐├┤   ├┴┐├─┤ │ │ ││││││    └─┐│  ├┬┘│├─┘ │ 
	// ┴  ┴ ┴┴└─└─┘└─┘  ┴ ┴┴ ┴ ┴ └─┘┴ ┴┴└─┘  └─┘└─┘┴└─┴┴   ┴ 
	// parse katomic script
	
    function parseKatomic(data) {
	  const lines = data.split('\n')
	  const alias = {}
	  const addHbarTransfer = []
	  const addTokenTransfer = []
	  const addNftTransfer = []
	  const display = {} // optional: title, description, thumbnail, button label
	  const comments = []

	  //advanced options
	  let parameters = {}
      let constants = {}
	  let conditions = []
	  
	  let result
      // lines.forEach(line => {
	  const pendingLines = lines.filter(rawline => {

        let comment
        [line, comment] = splitComment(rawline)
        if (comment) comments.push(rawline)
        if (!line) return false // skip empty lines
		
        result = detectNetwork(line)
		if (result) {
			network = result  // global var
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

		userInput = rawline
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

		result = detectTransferNFTviaSpender(line)
		if (result) {
			addNftTransfer.push({...result, userInput})
			return false
		}
		
		result = detectConditions(line)
		if (result) {
			conditions.push(result)
			return false
		}

		result = detectParameters(line)
		if (result) {
			parameters = {...parameters, ...result}
			return false
		}

		result = detectConstants(line)
		if (result) {
			constants = {...constants, ...result}
			return false
		}
        
		return true
      })

	conditions = condenseConditions(conditions)


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
	  
      return {network, display, alias, parameters, constants, conditions, addHbarTransfer, addTokenTransfer, addNftTransfer, pendingLines, comments, userInput: data} 
    }

	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ┌─┐┌─┐┬─┐┌─┐┌┬┐┌─┐┌┬┐┌─┐┬─┐┌─┐
	 // ││├┤  │ ├┤ │   │   ├─┘├─┤├┬┘├─┤│││├┤  │ ├┤ ├┬┘└─┐
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   ┴  ┴ ┴┴└─┴ ┴┴ ┴└─┘ ┴ └─┘┴└─└─┘
	// detect parameters
	function detectParameters(line) {
		// eg parameters user_code [enter promo code] text
		// interim to match gomint
		const regex = /parameters\s+(?<fieldName>[\w]+)\s+(?<fieldValue>.+)/
		const matches = line.match(regex)
		if (matches)
			return { [matches.groups.fieldName]: matches.groups.fieldValue }
	}

    // match constants (any values that must be permanently fixed by the deal)
	function detectConstants(line) {
		const regex = /constants\s+(?<fieldName>[\w]+)\s+(?<fieldValue>.+)/
		const matches = line.match(regex)
		if (matches)
			return { [matches.groups.fieldName]: matches.groups.fieldValue }
	}
    
    
	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ┌─┐┌─┐┌┐┌┌┬┐┬┌┬┐┬┌─┐┌┐┌┌─┐
	 // ││├┤  │ ├┤ │   │   │  │ ││││ │││ │ ││ ││││└─┐
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   └─┘└─┘┘└┘─┴┘┴ ┴ ┴└─┘┘└┘└─┘
	// detect conditions
	
	// advanced used only
	// interim process to match gomint

	function detectConditions(line) {
		// eg conditions 0 scriptName myscript
		const regex = /conditions\s+(?<index>\d+)\s+(?<fieldName>\w+)\s+(?<fieldValue>.+)/
		let matches = line.match(regex)
		if(matches)
		 return [ { [matches.groups.index]: { [matches.groups.fieldName]: matches.groups.fieldValue } } ]
	}

	//convert conditions object into an array
	function condenseConditions(conditions) {
		let condensed = []

		conditions.forEach(conditionArray => {
			let condition = conditionArray[0] // Extract the condition object
			let index = Object.keys(condition)[0] // Get the index (which is the key of the condition object)

			// If we don't have an object for this index in the result array, create one
			if (!condensed[index]) condensed[index] = {}

			// Merge the properties of the condition object into the appropriate object in the result array
			condensed[index] = {...condensed[index], ...condition[index]}
		})

		// Remove empty elements if indices were not in sequence or some were missing
		return condensed.filter(Boolean)
	}

	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ┌─┐┌─┐┌┬┐┌┬┐┌─┐┌┐┌┌┬┐
	 // ││├┤  │ ├┤ │   │   │  │ │││││││├┤ │││ │ 
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   └─┘└─┘┴ ┴┴ ┴└─┘┘└┘ ┴ 
	// detect comments
	function splitComment(line) {
        
        if (line.includes('://')) return [line.trim(), undefined] // don't allow comments if url on the line

        const parts = line.split(/(\/\/|#(?![1-9]))(.+)/)

        if (parts.length > 1) return [parts[0].trim(), parts[2]]

        return [line.trim(), undefined]



      let comment
      //[line, comment] = line.split(/(?:\/\/|#)(.+)/)   // split by // or #
      //[line, comment] = line.split(/(?:\/\/|#(?![1-9]))(.+)/) // dont split if there's a digit 1-9 immediately after the # ie NFT serial
        [line, comment] = line.split(/(\/\/|#(?![1-9]))(.+)/)   // no change?


      line = line.trim()    
	  return [line, comment]
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
      const regex = /display\s+(title|description|thumbnail|button|label)\s+(.+)/
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
		//either entity format 0.0.12345, or {some_variable}
		const pattern = /^(?<accountId>buyer|\d+\.\d+\.\d+|{[a-z0-9_-]+}) (?<verb>receives|sends) (?<value>[0-9.]+|{[a-z0-9_-]+}) (?<unit>hbar|h)$/i
		// buyer could be dropped - in for legacy purposes (gomint)
		
		const matches = line.match(pattern)
		if (!matches) return false

		let { accountId, verb, value, unit } = matches.groups

		let isValueVariable = /\{[a-zA-Z0-9_-]+\}/.test(value)
		if (isValueVariable) isSumValidationNeeded = false 
		
		if (verb == 'sends') 
			if (isValueVariable) value = '-' + value
			else value = -1 * value 
		
		
		return {accountId, value}
	}


	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ╔═╗╔╦╗  ┌┬┐┬─┐┌─┐┌┐┌┌─┐┌─┐┌─┐┬─┐
	 // ││├┤  │ ├┤ │   │   ╠╣  ║    │ ├┬┘├─┤│││└─┐├┤ ├┤ ├┬┘
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   ╚   ╩    ┴ ┴└─┴ ┴┘└┘└─┘└  └─┘┴└─
	// detect FT transfer	
	function detectTransferFT(line) {
		//const pattern = /^(\d+\.\d+\.\d+) (receives|sends) ([0-9.]+) (\d+\.\d+\.\d+)$/
		//const pattern = /^(buyer|\d+\.\d+\.\d+) (receives|sends) ([0-9.]+) (\d+\.\d+\.\d+)$/
		const pattern = /^(?<accountId>buyer|\d+\.\d+\.\d+|{[a-z0-9_-]+}) (?<verb>receives|sends) (?<value>[0-9.]+|{[a-z0-9_-]+}) (?<tokenId>\d+\.\d+\.\d+|{[a-z0-9_-]+})$/i
		
		const matches = line.match(pattern)
		if (!matches) return false
		
		let { accountId, verb, value, tokenId } = matches.groups

		let isValueVariable = /\{[a-zA-Z0-9_-]+\}/.test(value)
		if (isValueVariable) isSumValidationNeeded = false 
		
		if (verb == 'sends') 
			if (isValueVariable) value = '-' + value
			else value = -1 * value 
        
       

		let isTokenVariable = /\{[a-zA-Z0-9_-]+\}/.test(tokenId)
		if (isTokenVariable || isValueVariable)
			window.alert('Warning: token ID or value is a variable, so amount must be injected as a whole integer. Proceed with caution')
        else {
			let decimals = getDecimals(network, tokenId)
			//console.log(`decimals = ${decimals}`)
			if (!decimals && decimals !== 0) {
				window.alert('Sorry, there was an error fetching the token decimals')
				return false
			}
            value = value * Math.pow(10, decimals)
		}

		return {tokenId, accountId, value}
		
		//matching https://docs.hedera.com/hedera/sdks-and-apis/sdks/tokens/transfer-tokens
	}


// ┌─┐┌─┐┌┬┐  ┌┬┐┌─┐┌─┐┬┌┬┐┌─┐┬  ┌─┐  ┌─┐┌─┐┬─┐  ┌─┐  ┌┬┐┌─┐┬┌─┌─┐┌┐┌
// │ ┬├┤  │    ││├┤ │  ││││├─┤│  └─┐  ├┤ │ │├┬┘  ├─┤   │ │ │├┴┐├┤ │││
// └─┘└─┘ ┴   ─┴┘└─┘└─┘┴┴ ┴┴ ┴┴─┘└─┘  └  └─┘┴└─  ┴ ┴   ┴ └─┘┴ ┴└─┘┘└┘
// get decimals for a token

	function getDecimals(network, tokenId) {
	  let url = (network == 'mainnet') ? 'https://mainnet-public' : `https://${network}`
	  url += `.mirrornode.hedera.com/api/v1/tokens/${tokenId}`
	  
	  const request = new XMLHttpRequest()
	  //console.log(url)
	  request.open('GET', url, false)  // false makes the request synchronous
	  request.send(null)

	  if (request.status === 200) {
		try {
		  return JSON.parse(request.responseText).decimals
		} catch (e) {
		  console.error('Could not parse JSON:', e)
		}
	  } else console.error('Request failed:', request.status, request.statusText)
	  return null
	}


	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ╔╗╔╔═╗╔╦╗  ┌┬┐┬─┐┌─┐┌┐┌┌─┐┌─┐┌─┐┬─┐
	 // ││├┤  │ ├┤ │   │   ║║║╠╣  ║    │ ├┬┘├─┤│││└─┐├┤ ├┤ ├┬┘
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   ╝╚╝╚   ╩    ┴ ┴└─┴ ┴┘└┘└─┘└  └─┘┴└─
	// detect NFT transfer
	function detectTransferNFT(line) {
		//const pattern = /^(\d+\.\d+\.\d+) sends NFT (\d+\.\d+\.\d+)-(\d+) to (\d+\.\d+\.\d+)$/
		//const pattern = /^(\d+\.\d+\.\d+) sends(?: NFT)? (\d+\.\d+\.\d+)(?:-|#)(\d+) to (\d+\.\d+\.\d+)$/;
		//const pattern = /^(\d+\.\d+\.\d+) sends(?: NFT)? (\d+\.\d+\.\d+)(?: ?[-#])(\d+) to (\d+\.\d+\.\d+)$/
		//const pattern = /^(buyer|\d+\.\d+\.\d+) sends(?: NFT)? (\d+\.\d+\.\d+)(?: ?[-#])(\d+) to (buyer|\d+\.\d+\.\d+)$/
		//const pattern = /^(buyer|\d+\.\d+\.\d+) sends(?: NFT)? (\d+\.\d+\.\d+)(?: ?[-#])(\S+) to (buyer|\d+\.\d+\.\d+)$/
		//const pattern = /^(?<sender>\d+\.\d+\.\d+|{[a-z0-9_-]+}) sends(?: NFT)? (?<tokenId>\d+\.\d+\.\d+|{[a-z0-9_-]+})(?: ?[-#])(?<serial>\S+) to (?<receiver>\d+\.\d+\.\d+|{[a-z0-9_-]+})$/i
		const pattern = /^(?<sender>\d+\.\d+\.\d+|buyer|{[a-z0-9_-]+}) sends(?: NFT)? (?<tokenId>\d+\.\d+\.\d+|{[a-z0-9_-]+})(?: ?[-#])(?<serial>\S+) to (?<receiver>\d+\.\d+\.\d+|buyer|{[a-z0-9_-]+})$/i
		
		const matches = line.match(pattern)
		if (!matches) return false
		
		//const [_, sender, tokenId, serial, receiver] = matches
		let { sender, tokenId, serial, receiver } = matches.groups
		
		if (!/^(\d+|\d+to\d+|{[a-z0-9_-]+})$/.test(serial)) return false
		
		return {sender, tokenId, serial, receiver}
		
		//matching https://docs.hedera.com/hedera/sdks-and-apis/sdks/tokens/transfer-tokens
	}

	function detectTransferNFTviaSpender(line) {
		//repeating above but adding spender. could add to existing but safer to begin with new function
		const pattern = /^(buyer|\d+\.\d+\.\d+) sends(?: NFT)? (\d+\.\d+\.\d+)(?: ?[-#])(\d+) to (buyer|\d+\.\d+\.\d+) via (\d+\.\d+\.\d+)$/

		const matches = line.match(pattern)
		if (!matches) return false
		
		const [_, sender, tokenId, serial, receiver, spender] = matches
		return {sender, tokenId, serial, receiver, spender}
	}

	// ┌┬┐┌─┐┌┬┐┌─┐┌─┐┌┬┐  ┌─┐┌┐┌┌┬┐  ┬┌┐┌ ┬┌─┐┌─┐┌┬┐  ┌─┐┬  ┬┌─┐┌─┐
	 // ││├┤  │ ├┤ │   │   ├─┤│││ ││  ││││ │├┤ │   │   ├─┤│  │├─┤└─┐
	// ─┴┘└─┘ ┴ └─┘└─┘ ┴   ┴ ┴┘└┘─┴┘  ┴┘└┘└┘└─┘└─┘ ┴   ┴ ┴┴─┘┴┴ ┴└─┘
	// detect and inject alias
	
	// inject known alias into line
	function injectAlias(line, aliases) {
		let pattern = /^({[a-z0-9_-]+}|[a-zA-Z0-9\._-]+)\s+(sends|receives)\s+(.+)$/i
		if (!pattern.test(line)) return line
		for (let alias in aliases) 
			line = line.replace(new RegExp("\\b" + alias + "\\b", 'g'), aliases[alias])
		return line
	}

	//todo build in account check using 5 char checksum HIP15 #1
	function detectAlias(line) {
	  const pattern = /^([a-zA-Z0-9_-]+) is (\d+\.\d+\.\d+)$/i
	  const matches = line.match(pattern)
	  if (!matches) return false
	  const alias = matches[1]
	  const hac = matches[2]
	  return { [alias]: hac }
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
		
		
	  if (isSumValidationNeeded) { // if variables found in any transfers, skip validation
			
		if (sumHbar != 0) {
			document.getElementById('bannerNotice').innerHTML = `⚠️ Hbar transfers must sum to zero`  
			return false
		}

		// check FT transfers
		let sumFT = {}
		for (const transfer of deal.addTokenTransfer) {
			if (!sumFT[transfer.tokenId]) sumFT[transfer.tokenId] = 0
			sumFT[transfer.tokenId] += parseFloat(transfer.value)
			//console.log(`value x token ${transfer.value} x ${transfer.tokenId} ` + parseFloat(transfer.value))
		}

		for (let tokenId in sumFT) {
		  if (Math.abs(sumFT[tokenId]) > Math.pow(10, -10)) {
			  console.log('sum is ' +  sumFT[tokenId])
			document.getElementById('bannerNotice').innerHTML = `⚠️ FT transfers must sum to zero for token ${tokenId}`  
			return false
		  }
		  
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

		// allow katomic to write the deal to a custom endpoint
		// use page with ?dev to edit urlWriteDeal on the fly 
		// and/or set it in the config
        console.log(`network is ${network}`)
        const urlWriteDeal = document.getElementById('urlWriteDeal').value || CONFIG[network].urlWriteDeal || 'https://kpos.uk/deal/write'
		
		console.log(`publishData is using urlWriteDeal = ${urlWriteDeal}`)
		
		// multiple responses might be received, check the response object elements for results of each
		// todo replace this with appnet propagation
		const responses = await fetch(urlWriteDeal, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(deal) // Send the processed data as JSON
		})

		const results = await responses.json()
		//console.log(`urlWriteDeal result =`, results)
		// todo, if we need legacy compatibilty, first detect the format of the response
		// but i don't think this is needed

		let html = ''
		
		const urlPublishTemplate = CONFIG[deal.network].urlPublish
		const starttime = urlQuery.get('starttime') ?? ''
			
		let dealId
		let urlPublish
		
		// loop thru result from each saas domain
		Object.keys(results).forEach((saas_domain) => {
			const { code, result } = results[saas_domain]
			const { status } = result
			
			
			if (status === 'success') {
				dealId = result.data.dealId
				html += `Published to ${saas_domain}`
			}
			
			if (status === 'error') {
				const regex = /[0-9a-fA-F]{32,}$/
				const message = result.message
				const match = message.match(regex)
				if (match) dealId = match[0]
				html += `Deal already exists on ${saas_domain}`
			}
			
			if (!dealId) {
				html += `Failed to read dealId from ${saas_domain}<BR>`
				return
			}
			
			const dealId_short = dealId.substring(0, 6).toUpperCase()
			
			urlPublish = urlPublishTemplate.replace('${dealId}', dealId)
			
			html += ` <a href="${urlPublish}&starttime=${starttime}" target="_blank">${dealId_short}</a>`
			html += `<br>`

		})
					
	  document.getElementById('bannerNotice').innerHTML =  html
      //console.log('deal=', deal)
	  //const network = deal.network
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


