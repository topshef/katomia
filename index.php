<?php
// redirect option
// avoid redirect if any query, to avoid breaking links (later can redirect query too)
if (file_exists('redirect.txt') && $_SERVER['QUERY_STRING'] == '') {
	$url = trim(file_get_contents('redirect.txt'));
	header("Location: $url");
	exit;
}

// add some of the deal ID to the title to assist with multi-tab deal development
//(could do this in js also)
$title = 'Katomic';
$dealId = $_GET['dealId'] ?? false;
if ($dealId) $title .= ' ' . substr($dealId,0,5);

?>
<!DOCTYPE html>
<html>
<head>
  <title><?=$title?></title>
  
  <meta name="viewport" content="width=device-width, initial-scale=2.5">
  <link rel="stylesheet" href="katomic.css">

  <link rel="icon" href="K.ico" type="image/x-icon">

  <!-- code editor -->
  <link rel="stylesheet" href="codemirror.min.css">
  <!--  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css"> -->


  <script src="codemirror.min.js"></script>
  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script> -->
  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/javascript/javascript.min.js"></script> -->
  <script src="katomicCodeMirror.js<?php echo '?v=' . filemtime('katomicCodeMirror.js'); ?>"></script>

  
  <!-- json formatter https://highlightjs.org/ 
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/default.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/highlight.min.js"></script>
	not doing much -->

</head>
<body>
  <!-- <header> -->
    <header>
	  <a href='https://x.com/gokatomic' target='gokatomic'><img id='logo' src="kato2.png" alt="Kato" class="logo"></a>
	  <div class="logo-text"> <strong>Kato</strong> is <strong>#katomic</strong></div>
    </header>
  <!-- </header> -->
  
	<select id="kscriptTemplateOptions">
	  <option value="">Choose a template</option>
	</select>
    <code id='dealId' style='color:grey;'></code>
    <textarea id="myInputKscript" placeholder="Enter some #katomic script"></textarea>

    <div class="checkbox-wrapper">
      <input type="checkbox" id="showPretty" checked>
      <label for="showPretty">Formatted&nbsp(beta)</label>

      <input type="checkbox" id="showAdvanced">
      <label for="showAdvanced">Advanced&nbspoptions</label>
    </div>


	<span class='dev'>Publish to webhook</span>
	<input class='dev' id="urlWriteDeal" placeholder="urlWriteDeal eg https://kpos.uk/deal/write/?json" value=""></input>

  <div id='buttonsContainer'>
	  <div id='btnClear' class='tooltip' data-tooltip="Clear"><img src='trash.png' alt='trash' height="18px" style="padding-right: 10px"></div>
	  <div id='btnCopyPermalink' class='tooltip' data-tooltip="Copy to Clipboard">Copy permalink</div>
	  <button id='btnPreview'>Preview</button> 
	  <button id='btnPublish'>Publish</button> 
  </div>
  <div id='bannerNotice'></div>
  
  <div id='preview'></div>
  

  <div id='footer'>
	<HR>
	  <!--
	  <a href='https://feedback.katomic.org/' target='feedback'><img src='./img/feedback.png' alt='Github' height='30'></a>
	  -->
	  <span class='tooltip' data-tooltip="Give feedback, report a bug, or share ideas!">
		<a href='https://feedback.userreport.com/28128e53-a7f7-4d81-8125-6d3119abe94e/#ideas/popular' target='feedback'><img src='./img/feedback.png' alt='Feedback' height='25'></a>
	  </span>

	  <span class='tooltip' data-tooltip="Follow Kato on X/Twitter">
		<a href='https://x.com/gokatomic' target='gokatomic'><img src='./img/x-logo-black.png' alt='X' height='20'></a>
	  </span>
	  <span class='tooltip' data-tooltip="View or contribute code on Github">
		<a href='https://github.com/topshef/katomia/' target='katomia'><img src='./img/github-mark.svg' alt='Github' height='20'></a>
	  </span>

	  	  
	  <!-- 
	  <a href='https://meet.katomic.org' target='katomia'><img src='https://zep.us/images/light/layout/logo_zep.svg' alt='Zep' height='20'></a>
-->
	  
  </div>
  

  
  <!-- <script src="katomic.js"></script> --> 
  <script>
    var PATH_CONFIG = "config.json?v=<?php echo filemtime('config.json'); ?>"
    console.log('PATH_CONFIG=',PATH_CONFIG)
  </script>

  <script src="init.js<?php echo '?v=' . filemtime('init.js'); ?>"></script>

  <script src="typing.js"></script>


  <script>

		const pretty = (() => {
			const v = urlQuery.get('showPretty')
			if (v === '1') return true
			if (v === '0') return false
			return !urlQuery.has('kscript')
		})()
    
    // if (urlQuery.has('dev') || urlQuery.has('showPretty'))
		if (urlQuery.has('dev') || pretty)
        document.getElementById('kscriptTemplateOptions').style.display = 'none'
    
    // toggle options saving to url parameters
    // document.getElementById('showPretty').checked   = urlQuery.has('showPretty')
		document.getElementById('showPretty').checked = pretty
    
    console.log(urlQuery.has('dealId') , urlQuery.has('showPretty'))
		//default to show pretty if there's a dealId in the URL (but NOT when kscript is present)
		if (urlQuery.has('dealId') && !urlQuery.has('showPretty') && !urlQuery.has('kscript')) {
	
        console.log('default to pretty')
        //document.getElementById('showPretty').checked = 1
				urlQuery.set('showPretty', '1')
        //urlQuery['set']('dev', 'true')
        
        window.location.search = urlQuery.toString()
        
    }
    document.getElementById('showAdvanced').checked = urlQuery.has('dev')

		document.getElementById('showPretty').addEventListener('change', async function() {
			if (this.checked && window.typingNow?.promise)
				await window.typingNow.promise

			urlQuery.set('showPretty', this.checked ? '1' : '0')

			if (this.checked)
				urlQuery.delete('typingspeed')

			window.location.search = urlQuery.toString()
		})


		// document.getElementById('showPretty').addEventListener('change', function() {
			// urlQuery.set('showPretty', this.checked ? '1' : '0')
			// window.location.search = urlQuery.toString()
		// })

    document.getElementById('showAdvanced').addEventListener('change', function() {
      urlQuery[this.checked ? 'set' : 'delete']('dev', 'true')
      window.location.search = urlQuery.toString()
    })

    
    var editor
    // if (urlQuery.has('showPretty'))
		if (pretty)
        window.onload = function() {
            urlQuery.delete('typingspeed')
            editor = CodeMirror.fromTextArea(document.getElementById('myInputKscript'), {
            lineNumbers: false,
            mode: "text/katomic",
            theme: "default",
            lineWrapping: true
            })

            //hide template options (as not working atm)
            //document.getElementById('kscriptTemplateOptions').style.display = 'none'
            
            document.querySelector('header').style.display = 'none'
            //document.querySelector('.CodeMirror').style.color = 'blue'; // This should turn all text in the editor blue
        }
        

    document.addEventListener("DOMContentLoaded", function() {
      if (editor) window.editor.on("blur", updateKatomicURL) //editor.on("blur", updateKatomicURL)
      else document.getElementById("myInputKscript").addEventListener("change", updateKatomicURL)
    })


    // if user input is a hex string only then redirect to lookup that as the deal
    document.getElementById('btnPreview').addEventListener('click', function() {
        const inputKscript = document.getElementById('myInputKscript').value.trim()

        // Check if the input is a valid hexadecimal string (one line, no other characters)
        const hexRegex = /^[a-fA-F0-9]+$/
        if (hexRegex.test(inputKscript)) {
            // Update the URL with the hex string as dealId and reload the page
            const currentUrl = new URL(window.location.href)
            currentUrl.searchParams.set('dealId', inputKscript)
            currentUrl.searchParams.delete('kscript')

            window.location.href = currentUrl.toString()
        }
    })


  </script>


  <script src="katomic.js<?php echo '?v=' . filemtime('katomic.js'); ?>"></script>


</body>
</html>