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
  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="katomic.css">
  <link rel="icon" href="K.ico" type="image/x-icon">

  
  <!-- json formatter https://highlightjs.org/ 
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/default.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/highlight.min.js"></script>
	not doing much -->

</head>
<body>
  <!-- <header> -->
	  <a href='https://x.com/gokatomic' target='gokatomic'><img id='logo' src="logo.png" alt="Kato" class="logo"></a>
	  <div class="logo-text"> <strong>Kato</strong> is <strong>#katomic</strong></div>
  <!-- </header> -->
  
	<select id="kscriptTemplateOptions">
	  <option value="">Choose a template</option>
	</select>

    <textarea id="myInputKscript" placeholder="Enter some #katomic script"></textarea>

  
  <div id='buttonsContainer'>
<!--    <div class='tooltip' data-tooltip="Give feedback!"><a href='http://feedback.katomic.org' target='_blank'><img src='feedback.png' height='25px'></a></div> 
might be confused with give feedback on the script-->
	  <div id='btnClear' class='tooltip' data-tooltip="Clear"><img src='trash.png' alt='trash' height="18px" style="padding-right: 10px"></div>
	  <div id='btnCopyPermalink' class='tooltip' data-tooltip="Copy to Clipboard">Copy permalink</div>
	  <button id='btnPreview'>Preview</button> 
	  <button id='btnPublish'>Publish</button> 
  </div>
  <div id='bannerNotice'></div>
  
  <div id='preview'></div>
  
  <!-- <script src="katomic.js"></script> --> 
  <script>
    var PATH_CONFIG = "config.json?v=<?php echo filemtime('config.json'); ?>"
console.log('PATH_CONFIG=',PATH_CONFIG)
  </script>

  <script src="typing.js"></script>

  <script src="katomic.js<?php echo '?v=' . filemtime('katomic.js'); ?>"></script>

</body>
</html>