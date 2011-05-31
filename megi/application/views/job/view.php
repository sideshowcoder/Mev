<table id="jobviewtable">
  <tr class="roww"><td>Type</td><td><?php echo $job->type;?></td></tr>
  <tr class="rowb"><td>Name</td><td><?php echo $job->name;?></td></tr>
  <tr class="roww"><td>Date added</td><td><?php echo $job->add_date;?></td></tr>
  <tr class="rowb"><td>Date started</td><td><?php echo $job->start_date;?></td></tr>
  <tr class="roww"><td><?php echo anchor("/job/spec/$job->id", 'Show Specification', 'title="View Job Specification"');?></td><tr>
  <tr class="rowb"><td><?php echo anchor("/job/result/$job->id", 'Show Result', 'title="View Job Result"');?></td><tr>
</table>

<?php if($job->start_date == '0000-00-00 00:00:00'): ?>
  <div class="btn" id="start"><?php echo anchor("job/start/$job->id", 'Start this Job', 'title="Start"');?></div>
<?php else: ?>
  <div class="btn" id="start"><?php echo anchor("job/start/$job->id", 'Restart this Job', 'title="Restart"');?></div>
<?php endif; ?>

<div class="btn" id="back">
  <?php echo anchor('job', 'Back', 'title=Back');?>
</div>

