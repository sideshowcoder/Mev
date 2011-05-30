<?php echo form_open('job/create', array('id' => 'jobform'));?>
  <p class="jobformitem">Type: <?php echo form_dropdown('jobtype', $types, 'rdns');?></p>
  <p class="jobformitem">Name: <?php echo form_input(array('name' => 'jobname'));?></p>
  <p class="jobformitem">Input: <?php echo form_textarea(array('name' => 'jobspec', 'rows' => 24, 'cols' => 80));?></p>
  <p class="jobformitem"><?php echo form_submit('submit', 'Create Job');?><p> 
<?php echo form_close();?>

