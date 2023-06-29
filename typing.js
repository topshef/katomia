

// simulate the user typing in stuff.. for demo use / fun / get ppl thinking about connection with AI etc

function simulateTyping(elementId, text, options) {
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
  
  return new Promise(resolve => { // Wrap your function in a Promise
	  function typeNextLetter() {
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
		
		if (currentIndex < text.length) setTimeout(typeNextLetter, typingInterval)
		else resolve()
			
	  }
	
	typeNextLetter()
  })  // end of promise
}
