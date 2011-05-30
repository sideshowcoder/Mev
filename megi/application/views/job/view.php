<table id="jobviewtable">
  <tr id="jobviewtablerow"><td>Type</td><td><?php echo $job->type;?></td></tr>
  <tr id="jobviewtablerow"><td>Name</td><td><?php echo $job->name;?></td></tr>
  <tr id="jobviewtablerow"><td>Date added</td><td><?php echo $job->add_date;?></td></tr>
  <tr id="jobviewtablerow"><td>Date started</td><td><?php echo $job->start_date;?></td></tr>
  <tr id="jobviewtablerow"><td><?php echo anchor("/job/spec/$job->id", 'Show Specification', 'title="View Job Specification"');?></td><tr>
  <tr id="jobviewtablerow"><td><?php echo anchor("/job/result/$job->id", 'Show Result', 'title="View Job Result"');?></td><tr>
</table>

<?php if($job->start_date == '0000-00-00 00:00:00'): ?>
  <p class="btn" id="start"><?php echo anchor("job/start/$job->id", 'Start this Job', 'title="Start"');?></p>
<?php else: ?>
  <p class="btn" id="start"><?php echo anchor("job/start/$job->id", 'Restart this Job', 'title="Restart"');?></p>
<?php endif; ?>

<p class="btn" id="back">
  <?php echo anchor('job', 'Back', 'title=Back');?>
</p>

