<!doctype html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	
	<title>Megi</title>
	<meta name="description" content="">
	<meta name="author" content="">
	
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	
	<link rel="shortcut icon" href="/favicon.ico">
	<link rel="apple-touch-icon" href=<?php echo base_url()."public/apple-touch-icon.png";?>>
	<link rel="stylesheet" href=<?php echo base_url()."public/css/style.css?v=2";?>>

	<script src=<?php echo base_url()."/public/js/libs/modernizr-1.7.min.js";?>></script>
</head>
<body>
  <div id="container">
		<header></header>
		<div id="flash">
		<?php if($flash):?>
		  <?php echo $flash;?>
		<?php endif;?>
		</div>
  	<div id="main" role="main">
    