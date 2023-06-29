

// simulate the user typing in stuff.. for demo use / fun / get ppl thinking about connection with AI etc

let typingNow

function simulateTyping(elementId, text, options) {
  
  if (typingNow) typingNow.cancel() // cancel any previous typing
	  
  let { speed = 30, elementProperty = 'value' } = options || {}
  const typingDelay = 1000 / speed
  
  const element = document.getElementById(elementId)
  console.log("simulateTyping to begin on ID=", element)

  if (!element) {
    console.error(`Textbox with ID "${elementId}" not found.`)
    return;
  }

	  
  let currentIndex = 0
  //const typingInterval = speed
  let isCancelled = false
  let timeoutId = null
  
  const promise = new Promise((resolve, reject) => {
  //return new Promise(resolve => { // Wrap your function in a Promise
	  function typeNextLetter() {
		if (isCancelled) {
		  clearTimeout(timeoutId)
		  reject(new Error('Typing simulation cancelled'))
		  return
		}
		const currentText = element[elementProperty] || ''
		const nextLetter = text[currentIndex]
		//element.value = currentText + nextLetter
		element[elementProperty] =  currentText + nextLetter;


		currentIndex++
		element.scrollTop = element.scrollHeight // Scroll to the bottom of the element

		// add some randomness for more natural feel
		const delayVariation = 0.5
		const minDelay = typingDelay - (typingDelay * delayVariation)
		const maxDelay = typingDelay + (typingDelay * delayVariation)
		const currentDelay = Math.random() * (maxDelay - minDelay) + minDelay
		
		const typingInterval  = nextLetter === '\n' ? currentDelay * 7 : currentDelay
		
		if (currentIndex < text.length)
			timeoutId = setTimeout(typeNextLetter, typingInterval)
		else resolve()
			
	  }
	
	typeNextLetter()
  })  // end of promise
  
  typingNow = {
    promise,
    cancel: () => { isCancelled = true }
  }
  
  return typingNow
}
