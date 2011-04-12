<?php echo form_open('job/create');?>
<p>Type: <?php echo form_dropdown('jobtype', $types, 'rdns');?></p>
<p>Input: <?php echo form_textarea(array('name' => 'jobspec', 'rows' => 24, 'cols' => 80));?></p>
<p><?php echo form_submit('submit', 'Create Job');?><p> 
<?php echo form_close();?>

