<table>

<tr><td>Type</td><td><?php echo $job->type;?></td></tr>
<tr><td>Name</td><td><?php echo $job->name;?></td></tr>
<tr><td>Date added</td><td><?php echo $job->add_date;?></td></tr>
<tr><td>Date started</td><td><?php echo $job->start_date;?></td></tr>
<tr><td><?php echo anchor("/job/spec/$job->id", 'Show Specification', 'title="View Job Specification"');?></td><tr>
<tr><td><?php echo anchor("/job/result/$job->id", 'Show Result', 'title="View Job Result"');?></td><tr>

</table>

<?php if($job->start_date == '0000-00-00 00:00:00'): ?>
  <p><?php echo anchor("job/start/$job->id", 'Start this Job', 'title="Start"');?></p>
<?php else: ?>
  <p><?php echo anchor("job/start/$job->id", 'Restart this Job', 'title="Restart"');?></p>
<?php endif; ?>

<p>
  <?php echo anchor('job', 'Back', 'title=Back');?>
</p>

