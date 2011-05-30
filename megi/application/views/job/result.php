<div id="jobresult">
  <?php if($result): ?>
    <p><?php echo $result;?></p>
  <?php else: ?>
    <p>Job not started yet</p>
  <?php endif; ?>
</div>
<p class="btn" id="back">
  <?php echo anchor('job/view/'.$job->id, 'Back', 'title=Back');?>
</p>