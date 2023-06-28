

// simulate the user typing in stuff.. for demo use / fun / get ppl thinking about connection with AI etc

function simulateTyping(textboxId, text, options) {
  let { speed = 1 } = options || {}
  const typingDelay = 1000 / speed
  
  const textbox = document.getElementById(textboxId)
  if (!textbox) {
    console.error(`Textbox with ID "${textboxId}" not found.`)
    return;
  }

  let currentIndex = 0
  //const typingInterval = speed
  
  
  function typeNextLetter() {
    const currentText = textbox.value || ''
    const nextLetter = text[currentIndex]
    textbox.value = currentText + nextLetter

    currentIndex++
    textbox.scrollTop = textbox.scrollHeight // Scroll to the bottom of the textbox

	// add some randomness for more natural feel
	const delayVariation = 0.5
	const minDelay = typingDelay - (typingDelay * delayVariation)
	const maxDelay = typingDelay + (typingDelay * delayVariation)
	const currentDelay = Math.random() * (maxDelay - minDelay) + minDelay
	
	const typingInterval  = nextLetter === '\n' ? currentDelay * 7 : currentDelay
	
    if (currentIndex < text.length) setTimeout(typeNextLetter, typingInterval)
		
  }

  typeNextLetter()
}
