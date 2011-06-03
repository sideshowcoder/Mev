<table id="jobviewtable">
  <tr class="roww"><td>Type</td><td><?php echo $job->type;?></td></tr>
  <tr class="rowb"><td>Name</td><td><?php echo $job->name;?></td></tr>
  <tr class="roww"><td>Date added</td><td><?php echo $job->add_date;?></td></tr>
  <tr class="rowb"><td>Date started</td><td><?php echo $job->start_date;?></td></tr>
  <tr class="roww"><td></td><tr>
  <tr class="rowb"><td></td><tr>
</table>
<div id="navlist">
  <div class="navitem"><?php echo anchor('job', 'Back', 'title=Back');?></div>
  <?php if($job->start_date == '0000-00-00 00:00:00'): ?>
    <div class="navitem" id="start"><?php echo anchor("job/start/$job->id", 'Start this Job', 'title="Start"');?></div>
  <?php else: ?>
    <div class="navitem" id="start"><?php echo anchor("job/start/$job->id", 'Restart this Job', 'title="Restart"');?></div>
  <?php endif; ?>
  <div class="navitem"><?php echo anchor("/job/result/$job->id", 'Show Result', 'title="View Job Result"');?></div>
  <div class="navitem"><?php echo anchor("/job/spec/$job->id", 'Show Specification', 'title="View Job Specification"');?></div>
</div>

