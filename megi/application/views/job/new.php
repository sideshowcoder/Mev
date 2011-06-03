<?php echo form_open('job/create', array('id' => 'jobform'));?>
  <table>
    <tr><td>Type</td> <td><?php echo form_dropdown('jobtype', $types, 'rdns');?></td><td>Module to use for measurement</td></tr>
    <tr><td>Name</td><td><?php echo form_input(array('name' => 'jobname'));?></td><td>Name for the job</td></tr>
    <tr><td>Input</td><td><?php echo form_textarea(array('name' => 'jobspec', 'rows' => 24, 'cols' => 80));?></td><td>Data to be passed to the Module</td></tr>
    <tr><td></td><td><?php echo form_submit(array('name' => 'submit', 'value' => 'Create Job', 'class' => 'navitem'));?></td></tr>
  </table>
<?php echo form_close();?>
