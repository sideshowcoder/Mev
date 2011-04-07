<html>

<head>
<title>Megi: Mev</title>
</head>

<body>
<h1>Mev</h1>

<h2>Create a new job for Mev</h2>
<p>Specifiy a Job to be run via Mev<p>

<?php echo form_open('mev/new_job');?>
<p>Name: <input type='text' name='jobname' size='60'/></p>
<p>Input as Text: <textarea name='jobspectxt' rows='24' cols='80'></textarea></p>
<p>Input as Txt file: <input type='file' name='jobspecfile'/><p>
<p><input type='submit' value='Create Job' /><p> 
</form>

</body>

</html>
