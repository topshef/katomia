<!DOCTYPE html>
<html>
<head>
  <title>Simple Webpage</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
    
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Indie Flower', cursive;
	  background-color: #fff7d9;
    }
    
    input[type="text"] {
      padding: 10px;
      width: 200px;
    }
    
    button {
      padding: 10px 20px;
      margin-top: 10px;
      border: none;
      background-color: #e9e9e9;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <img src="logo.png" alt="Logo" height="100px">
  <input type="text" placeholder="Enter your text">
  <button>Click Me</button>
</body>
</html>
