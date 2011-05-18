<?php if($result): ?>
  <?php echo $result;?>
<?php else: ?>
  <p>Job not started yet</p>
<?php endif; ?>

<p>
  <?php echo anchor('job/view/'.$job->id, 'Back', 'title=Back');?>
</p>