<div id="jobresult">
  <?php if($result): ?>
    <?php $rowcolor = 'w';?>
    <?php foreach($result as $r): ?> 
      <div class=<?php echo 'row'.$rowcolor;?>><?php echo $r;?></div>
      <?php $rowcolor == 'b' ? $rowcolor = 'w' : $rowcolor = 'b'; ?>
    <?php endforeach;?>
  <?php else: ?>
    <p>Job not started yet</p>
  <?php endif; ?>
</div>
<div id='navlist'>
  <div class="navitem"><?php echo anchor('job/view/'.$job->id, 'Back', 'title=Back');?></div>
  <div class="navitem"><?php echo anchor('job/result_download/'.$job->id, 'Download Result', 'title=Download Result');?></div>
</div>
