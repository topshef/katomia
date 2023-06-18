<!DOCTYPE html>
<html>
<head>
  <title>Katomic demo</title>
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="katomic.css">
  
  <!-- json formatter https://highlightjs.org/ 
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/default.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/highlight.min.js"></script>
	not doing much -->

</head>
<body>
  <!-- <header> -->
	  <img src="logo.png" alt="Logo" class="logo">
	  <div class="logo-text"> <strong>Kato</strong> is <strong>#katomic</strong></div>
  <!-- </header> -->
  
  <!-- options on hold 
	  <label for="options">Choose an option:</label>
	  <select id="kscriptTemplateOptions">
		<option value="">Select an option</option>
		<option value="Option 1">Option 1</option>
		<option value="Option 2">Option 2</option>
		<option value="Option 3">Option 3</option>
	  </select>
	  -->
	  
	  <textarea id="myInputKscript" placeholder="Enter some #katomic script"></textarea>

  
  <div id='buttonsContainer'>
	  <button id='btnPreview'>Preview</button> 
	  <button id='btnCopyPermalink'>Copy permalink</button>
	  <button id='btnPublish'>Publish</button> 
  </div>
  <div id='bannerNotice'></div>
  
  <div id='preview'></div>
  
  <script src="katomic.js"></script>
</body>
</html>
