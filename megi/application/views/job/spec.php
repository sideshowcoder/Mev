<div id="jobspec">
  <?php $rowcolor = 'w';?>
  <?php foreach($spec as $s): ?> 
    <div class=<?php echo 'row'.$rowcolor;?>><?php echo $s;?></div>
    <?php $rowcolor == 'b' ? $rowcolor = 'w' : $rowcolor = 'b'; ?>
  <?php endforeach;?>
</div>
<div id="navlist">
  <p class="navitem" id="back">
    <?php echo anchor('job/view/'.$job->id, 'Back', 'title=Back');?>
  </p>
</div>
